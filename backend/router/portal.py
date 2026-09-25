from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import IntegrityError
from dependencies import admin_dependency, db_dependency, user_dependency
from models import Area, Complaint, User
from router.auth import bcrypt_context
from schemas import AreaResponse, ComplaintAssign, ComplaintCreate, ComplaintResponse, PasswordUpdate, StaffCreate, UserResponse, UserUpdate

router = APIRouter(tags=["Portal"])


def save(db):
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "Username, email or phone is already in use.")


@router.get("/areas", response_model=list[AreaResponse])
def areas(db: db_dependency):
    return db.query(Area).order_by(Area.area_name).all()


@router.get("/users/me", response_model=UserResponse)
def profile(current_user: user_dependency):
    return current_user


@router.put("/users/me", response_model=UserResponse)
def update_profile(data: UserUpdate, current_user: user_dependency, db: db_dependency):
    if data.postal_code and not db.query(Area).filter_by(postal_code=data.postal_code).first():
        raise HTTPException(400, "Please select an existing area.")
    for name, value in data.model_dump(exclude_unset=True).items():
        if name != "postal_code" and (value is None or not value.strip()):
            raise HTTPException(400, "Profile fields cannot be empty.")
        setattr(current_user, name, value)
    save(db)
    db.refresh(current_user)
    return current_user


@router.put("/users/me/password")
def change_password(data: PasswordUpdate, current_user: user_dependency, db: db_dependency):
    if not bcrypt_context.verify(data.old_password, current_user.password_hash):
        raise HTTPException(400, "Current password is incorrect.")
    if len(data.new_password.encode("utf-8")) > 72:
        raise HTTPException(400, "Password must be at most 72 bytes.")
    current_user.password_hash = bcrypt_context.hash(data.new_password)
    save(db)
    return {"message": "Password updated."}


@router.get("/users/me/complaints", response_model=list[ComplaintResponse])
def my_complaints(current_user: user_dependency, db: db_dependency):
    return db.query(Complaint).filter_by(user_id=current_user.id).order_by(Complaint.id.desc()).all()


@router.post("/users/me/complaints", response_model=ComplaintResponse, status_code=201)
def report_complaint(data: ComplaintCreate, current_user: user_dependency, db: db_dependency):
    if not data.title.strip() or not data.description.strip():
        raise HTTPException(400, "Please enter a title and description.")
    if not db.query(Area).filter_by(postal_code=data.postal_code).first():
        raise HTTPException(400, "Please select an existing area.")
    complaint = Complaint(**data.model_dump(), user_id=current_user.id, status="Pending")
    db.add(complaint)
    save(db)
    db.refresh(complaint)
    return complaint


@router.get("/admin/users", response_model=list[UserResponse])
def users(current_user: admin_dependency, db: db_dependency):
    return db.query(User).order_by(User.id).all()


@router.post("/admin/staff", response_model=UserResponse, status_code=201)
def create_staff(data: StaffCreate, current_user: admin_dependency, db: db_dependency):
    if len(data.password.encode("utf-8")) > 72:
        raise HTTPException(400, "Password must be at most 72 bytes.")
    if data.postal_code and not db.query(Area).filter_by(postal_code=data.postal_code).first():
        raise HTTPException(400, "Area does not exist.")
    staff = User(**data.model_dump(exclude={"password"}), password_hash=bcrypt_context.hash(data.password))
    db.add(staff)
    save(db)
    db.refresh(staff)
    return staff


@router.put("/admin/complaints/{complaint_id}/assign", response_model=ComplaintResponse)
def assign_complaint(complaint_id: int, data: ComplaintAssign, current_user: admin_dependency, db: db_dependency):
    complaint = db.query(Complaint).filter_by(id=complaint_id).first()
    if not complaint:
        raise HTTPException(404, "Complaint not found.")
    technician = db.query(User).filter_by(id=data.assigned_to, role="technician", is_active=True).first()
    if not technician:
        raise HTTPException(400, "Please select an active technician.")
    complaint.assigned_to = technician.id
    complaint.status = "Assigned"
    save(db)
    db.refresh(complaint)
    return complaint
