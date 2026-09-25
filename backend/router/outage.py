from fastapi import APIRouter
from dependencies import admin_dependency, db_dependency
from models import LoadShedding, OutageHistory
from schemas import (
    LoadSheddingResponse,
    OutageHistoryCreate,
    OutageHistoryResponse,
)

# =====================================
# Router Configuration
# =====================================

router = APIRouter(prefix="/outage", tags=["Outage"])


# =====================================
# View All Load Shedding Schedule
# =====================================


@router.get(
    "/loadshedding", response_model=list[LoadSheddingResponse]
)
def get_all_loadshedding(db: db_dependency):
    schedules = db.query(LoadShedding).all()

    return schedules


# =====================================
# View Load Shedding By Postal Code
# =====================================


@router.get(
    "/loadshedding/{postal_code}",
    response_model=list[LoadSheddingResponse],
)
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


@router.get("/history", response_model=list[OutageHistoryResponse])
def get_outage_history(db: db_dependency):
    history = db.query(OutageHistory).all()

    return history


# =====================================
# Create Outage History
# Admin Only
# =====================================


@router.post("/history", response_model=OutageHistoryResponse)
def create_outage_history(
    outage_data: OutageHistoryCreate,
    current_user: admin_dependency,
    db: db_dependency,
):
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