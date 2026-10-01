from datetime import timezone

from fastapi import APIRouter, HTTPException
from dependencies import db_dependency, user_dependency
from models import Area, LoadShedding, OutageHistory
from schemas import OutageHistoryCreate, OutageHistoryUpdate

# =====================================
# Router Configuration
# =====================================

router = APIRouter(prefix="/outage", tags=["Outage"])


# =====================================
# View All Load Shedding Schedule
# =====================================


@router.get("/loadshedding")
def get_all_loadshedding(db: db_dependency):
    schedules = db.query(LoadShedding).all()

    return schedules


# =====================================
# View Load Shedding By Postal Code
# =====================================


@router.get("/loadshedding/{postal_code}")
def get_area_loadshedding(
    postal_code: str, db: db_dependency
):
    schedules = (
        db.query(LoadShedding)
        .filter(LoadShedding.postal_code == postal_code)
        .all()
    )

    return schedules


# =====================================
# View Outage History
# =====================================


@router.get("/history")
def get_outage_history(db: db_dependency):
    history = db.query(OutageHistory).all()

    return history


# =====================================
# Create Outage History
# Admin Only
# =====================================


@router.post("/history")
def create_outage_history(
    outage_data: OutageHistoryCreate,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    if db.query(Area).filter_by(postal_code=outage_data.postal_code).first() is None:
        raise HTTPException(status_code=404, detail="Area not found")
    if outage_data.end_time is not None and outage_data.end_time <= outage_data.start_time:
        raise HTTPException(400, "End time must be after start time.")

    new_outage = OutageHistory(
        postal_code=outage_data.postal_code,
        start_time=outage_data.start_time,
        end_time=outage_data.end_time,
        reason=outage_data.reason,
    )

    db.add(new_outage)
    db.commit()
    db.refresh(new_outage)

    return new_outage


@router.put("/history/{outage_id}")
def update_outage_history(
    outage_id: int,
    outage_data: OutageHistoryUpdate,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    outage = db.query(OutageHistory).filter_by(id=outage_id).first()
    if outage is None:
        raise HTTPException(status_code=404, detail="Outage history not found")

    update_data = outage_data.model_dump(exclude_unset=True)
    start = update_data.get("start_time", outage.start_time)
    end = update_data.get("end_time", outage.end_time)
    if end is not None:
        start = start.astimezone(timezone.utc).replace(tzinfo=None) if start.tzinfo else start
        end = end.astimezone(timezone.utc).replace(tzinfo=None) if end.tzinfo else end
        if end <= start:
            raise HTTPException(400, "End time must be after start time.")
        if "start_time" in update_data:
            update_data["start_time"] = start
        if "end_time" in update_data:
            update_data["end_time"] = end

    for key, value in update_data.items():
        setattr(outage, key, value)

    db.commit()
    db.refresh(outage)
    return outage


@router.delete("/history/{outage_id}")
def delete_outage_history(
    outage_id: int,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    outage = db.query(OutageHistory).filter_by(id=outage_id).first()
    if outage is None:
        raise HTTPException(status_code=404, detail="Outage history not found")

    db.delete(outage)
    db.commit()
    return {"message": "Outage history deleted successfully."}