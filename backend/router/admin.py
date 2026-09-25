from datetime import timezone
from fastapi import APIRouter, HTTPException
from dependencies import admin_dependency, db_dependency
from models import Area, Complaint, LoadShedding, User
from schemas import (
    AreaCreate,
    AreaResponse,
    AreaUpdate,
    ComplaintResponse,
    LoadSheddingCreate,
    LoadSheddingResponse,
    LoadSheddingUpdate,
)

router = APIRouter(prefix="/admin", tags=["Admin"])


# =====================================
# View All Complaints
# =====================================


@router.get("/complaints", response_model=list[ComplaintResponse])
def get_all_complaints(
    current_user: admin_dependency,
    db: db_dependency,
):
    complaints = db.query(Complaint).all()
    return complaints


# =====================================
# View Complaints By Area
# =====================================


@router.get(
    "/complaints/{postal_code}", response_model=list[ComplaintResponse]
)
def get_area_complaints(
    postal_code: str,
    current_user: admin_dependency,
    db: db_dependency,
):
    complaints = (
        db.query(Complaint)
        .filter(Complaint.postal_code == postal_code)
        .all()
    )

    return complaints


# =====================================
# View All Technicians
# =====================================


@router.get("/technicians")
def get_all_technicians(
    current_user: admin_dependency,
    db: db_dependency,
):
    technicians = db.query(User).filter(User.role == "technician").all()

    return technicians


# =====================================
# Create Area
# =====================================


@router.post("/create_area", response_model=AreaResponse)
def create_area(
    area_data: AreaCreate,
    current_user: admin_dependency,
    db: db_dependency,
):
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


@router.put("/update_area/{postal_code}", response_model=AreaResponse)
def update_area(
    postal_code: str,
    area_data: AreaUpdate,
    current_user: admin_dependency,
    db: db_dependency,
):
    area = db.query(Area).filter(Area.postal_code == postal_code).first()

    if area is None:
        raise HTTPException(status_code=404, detail="Area not found")

    if area_data.area_name:
        area.area_name = area_data.area_name

    if area_data.district:
        area.district = area_data.district

    if area_data.postal_code and area_data.postal_code != postal_code:
        raise HTTPException(400, "Postal codes cannot be changed because other records use them.")

    db.commit()
    db.refresh(area)

    return area


# =====================================
# Create Load Shedding Schedule
# =====================================


@router.post(
    "/create_loadshedding", response_model=LoadSheddingResponse
)
def create_loadshedding(
    data: LoadSheddingCreate,
    current_user: admin_dependency,
    db: db_dependency,
):
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
        created_by=current_user.id,
    )

    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)

    return new_schedule


# =====================================
# Update Load Shedding
# =====================================


@router.put(
    "/update_loadshedding/{id}", response_model=LoadSheddingResponse
)
def update_loadshedding(
    id: int,
    data: LoadSheddingUpdate,
    current_user: admin_dependency,
    db: db_dependency,
):
    schedule = db.query(LoadShedding).filter(LoadShedding.id == id).first()

    if schedule is None:
        raise HTTPException(
            status_code=404, detail="Schedule not found"
        )

    start = data.start_time or schedule.start_time
    end = data.end_time or schedule.end_time
    start = start.astimezone(timezone.utc).replace(tzinfo=None) if start.tzinfo else start
    end = end.astimezone(timezone.utc).replace(tzinfo=None) if end.tzinfo else end
    if end <= start:
        raise HTTPException(400, "End time must be after start time.")
    if data.postal_code and not db.query(Area).filter_by(postal_code=data.postal_code).first():
        raise HTTPException(400, "Area does not exist.")

    if data.postal_code:
        schedule.postal_code = data.postal_code

    if data.start_time:
        schedule.start_time = start

    if data.end_time:
        schedule.end_time = end

    if data.reason:
        schedule.reason = data.reason

    if data.status:
        schedule.status = data.status

    db.commit()
    db.refresh(schedule)

    return schedule