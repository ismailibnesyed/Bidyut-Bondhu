from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.exc import IntegrityError
from dependencies import db_dependency, user_dependency
from models import Area, Complaint, User
from router.auth import bcrypt_context
from schemas import (
    ComplaintAssign,
    ComplaintCreate,
    PasswordUpdate,
    StaffCreate,
    UserResponse,
    UserUpdate,
)

router = APIRouter(tags=["Portal"])


def save(db):
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "Username, email or phone is already in use.")


@router.get("/areas")
def areas(db: db_dependency):
    return db.query(Area).order_by(Area.area_name).all()


@router.get("/users/me", response_model=UserResponse)
def profile(current_user: user_dependency, db: db_dependency):
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if user is None:
        raise HTTPException(401, "User not found.")
    return jsonable_encoder(user)


@router.put("/users/me", response_model=UserResponse)
def update_profile(data: UserUpdate, current_user: user_dependency, db: db_dependency):
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if user is None:
        raise HTTPException(401, "User not found.")
    if data.postal_code and not db.query(Area).filter_by(postal_code=data.postal_code).first():
        raise HTTPException(400, "Please select an existing area.")
    for name, value in data.model_dump(exclude_unset=True).items():
        if name != "postal_code" and (value is None or not value.strip()):
            raise HTTPException(400, "Profile fields cannot be empty.")
        setattr(user, name, value)
    save(db)
    db.refresh(user)
    return jsonable_encoder(user)


@router.put("/users/me/password")
def change_password(data: PasswordUpdate, current_user: user_dependency, db: db_dependency):
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if user is None:
        raise HTTPException(401, "User not found.")
    if not bcrypt_context.verify(data.old_password, user.password_hash):
        raise HTTPException(400, "Current password is incorrect.")
    if len(data.new_password.encode("utf-8")) > 72:
        raise HTTPException(400, "Password must be at most 72 bytes.")
    user.password_hash = bcrypt_context.hash(data.new_password)
    save(db)
    return {"message": "Password updated."}


@router.get("/users/me/complaints")
def my_complaints(current_user: user_dependency, db: db_dependency):
    return db.query(Complaint).filter_by(user_id=current_user["id"]).order_by(Complaint.id.desc()).all()


@router.post("/users/me/complaints", status_code=201)
def report_complaint(data: ComplaintCreate, current_user: user_dependency, db: db_dependency):
    if not data.title.strip() or not data.description.strip():
        raise HTTPException(400, "Please enter a title and description.")
    if not db.query(Area).filter_by(postal_code=data.postal_code).first():
        raise HTTPException(400, "Please select an existing area.")
    complaint = Complaint(**data.model_dump(), user_id=current_user["id"], status="Pending")
    db.add(complaint)
    save(db)
    db.refresh(complaint)
    return complaint


@router.delete("/users/me/complaints/{complaint_id}")
def delete_my_complaint(
    complaint_id: int,
    current_user: user_dependency,
    db: db_dependency,
):
    complaint = db.query(Complaint).filter_by(
        id=complaint_id,
        user_id=current_user["id"],
    ).first()
    if complaint is None:
        raise HTTPException(404, "Complaint not found.")
    if complaint.status != "Pending":
        raise HTTPException(400, "Only pending complaints can be deleted.")

    db.delete(complaint)
    db.commit()
    return {"message": "Complaint deleted successfully."}


@router.get("/admin/users", response_model=list[UserResponse])
def users(current_user: user_dependency, db: db_dependency):
    if current_user["role"] != "admin":
        raise HTTPException(403, "Permission denied")
    users = db.query(User).order_by(User.id).all()
    return jsonable_encoder(users)


@router.post("/admin/staff", response_model=UserResponse, status_code=201)
def create_staff(data: StaffCreate, current_user: user_dependency, db: db_dependency):
    if current_user["role"] != "admin":
        raise HTTPException(403, "Permission denied")
    if len(data.password.encode("utf-8")) > 72:
        raise HTTPException(400, "Password must be at most 72 bytes.")
    if data.postal_code and not db.query(Area).filter_by(postal_code=data.postal_code).first():
        raise HTTPException(400, "Area does not exist.")
    staff = User(**data.model_dump(exclude={"password"}), password_hash=bcrypt_context.hash(data.password))
    db.add(staff)
    save(db)
    db.refresh(staff)
    return jsonable_encoder(staff)


@router.delete("/admin/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(403, "Permission denied")
    if user_id == current_user["id"]:
        raise HTTPException(400, "You cannot delete your own account.")

    user = db.query(User).filter_by(id=user_id).first()
    if user is None:
        raise HTTPException(404, "User not found.")

    db.delete(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            400,
            "User is linked to other records and cannot be deleted.",
        )
    return {"message": "User deleted successfully."}


@router.put("/admin/complaints/{complaint_id}/assign")
def assign_complaint(complaint_id: int, data: ComplaintAssign, current_user: user_dependency, db: db_dependency):
    if current_user["role"] != "admin":
        raise HTTPException(403, "Permission denied")
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
