from datetime import timezone
from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.exc import IntegrityError
from dependencies import db_dependency, user_dependency
from models import Area, Complaint, LoadShedding, User
from schemas import (
    AreaCreate,
    AreaUpdate,
    LoadSheddingCreate,
    LoadSheddingUpdate,
    UserResponse,
)

router = APIRouter(prefix="/admin", tags=["Admin"])


# =====================================
# View All Complaints
# =====================================


@router.get("/complaints")
def get_all_complaints(
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    complaints = db.query(Complaint).all()
    return complaints


# =====================================
# View Complaints By Area
# =====================================


@router.get("/complaints/{postal_code}")
def get_area_complaints(
    postal_code: str,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    complaints = (
        db.query(Complaint)
        .filter(Complaint.postal_code == postal_code)
        .all()
    )

    return complaints


@router.delete("/complaints/{complaint_id}")
def delete_complaint(
    complaint_id: int,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")

    db.delete(complaint)
    db.commit()
    return {"message": "Complaint deleted successfully."}


# =====================================
# View All Technicians
# =====================================


@router.get("/technicians", response_model=list[UserResponse])
def get_all_technicians(
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    technicians = db.query(User).filter(User.role == "technician").all()

    return jsonable_encoder(technicians)


# =====================================
# Create Area
# =====================================


@router.post("/create_area")
def create_area(
    area_data: AreaCreate,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    existing_area = (
        db.query(Area)
        .filter(Area.postal_code == area_data.postal_code)
        .first()
    )

    if existing_area:
        raise HTTPException(
            status_code=400, detail="Area already exists"
        )

    new_area = Area(
        area_name=area_data.area_name,
        district=area_data.district,
        postal_code=area_data.postal_code,
    )

    db.add(new_area)
    db.commit()
    db.refresh(new_area)

    return new_area


# =====================================
# Update Area
# =====================================


@router.put("/update_area/{postal_code}")
def update_area(
    postal_code: str,
    area_data: AreaUpdate,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    area = db.query(Area).filter(Area.postal_code == postal_code).first()

    if area is None:
        raise HTTPException(status_code=404, detail="Area not found")

    update_data = area_data.model_dump(exclude_unset=True)
    if update_data.get("postal_code") and update_data["postal_code"] != postal_code:
        raise HTTPException(400, "Postal codes cannot be changed because other records use them.")

    for key, value in update_data.items():
        setattr(area, key, value)

    db.commit()
    db.refresh(area)

    return area


@router.delete("/delete_area/{postal_code}")
def delete_area(
    postal_code: str,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    area = db.query(Area).filter(Area.postal_code == postal_code).first()
    if area is None:
        raise HTTPException(status_code=404, detail="Area not found")

    db.delete(area)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Area is in use and cannot be deleted.",
        )
    return {"message": "Area deleted successfully."}


# =====================================
# Create Load Shedding Schedule
# =====================================


@router.post("/create_loadshedding")
def create_loadshedding(
    data: LoadSheddingCreate,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    area = db.query(Area).filter(Area.postal_code == data.postal_code).first()

    if area is None:
        raise HTTPException(status_code=404, detail="Area not found")

    start = data.start_time
    end = data.end_time
    start = start.astimezone(timezone.utc).replace(tzinfo=None) if start.tzinfo else start
    end = end.astimezone(timezone.utc).replace(tzinfo=None) if end.tzinfo else end
    if end <= start:
        raise HTTPException(400, "End time must be after start time.")

    new_schedule = LoadShedding(
        postal_code=data.postal_code,
        start_time=start,
        end_time=end,
        status=data.status,
        reason=data.reason,
        created_by=current_user["id"],
    )

    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)

    return new_schedule


# =====================================
# Update Load Shedding
# =====================================


@router.put("/update_loadshedding/{id}")
def update_loadshedding(
    id: int,
    data: LoadSheddingUpdate,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    schedule = db.query(LoadShedding).filter(LoadShedding.id == id).first()

    if schedule is None:
        raise HTTPException(
            status_code=404, detail="Schedule not found"
        )

    update_data = data.model_dump(exclude_unset=True)
    start = update_data.get("start_time", schedule.start_time)
    end = update_data.get("end_time", schedule.end_time)
    start = start.astimezone(timezone.utc).replace(tzinfo=None) if start.tzinfo else start
    end = end.astimezone(timezone.utc).replace(tzinfo=None) if end.tzinfo else end
    if end <= start:
        raise HTTPException(400, "End time must be after start time.")
    if update_data.get("postal_code") and not db.query(Area).filter_by(postal_code=update_data["postal_code"]).first():
        raise HTTPException(400, "Area does not exist.")

    if "start_time" in update_data:
        update_data["start_time"] = start
    if "end_time" in update_data:
        update_data["end_time"] = end

    for key, value in update_data.items():
        setattr(schedule, key, value)

    db.commit()
    db.refresh(schedule)

    return schedule


@router.delete("/delete_loadshedding/{id}")
def delete_loadshedding(
    id: int,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    schedule = db.query(LoadShedding).filter(LoadShedding.id == id).first()
    if schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")

    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted successfully."}