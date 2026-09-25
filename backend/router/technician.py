from fastapi import APIRouter, HTTPException
from dependencies import db_dependency, technician_dependency
from models import Complaint
from schemas import ComplaintResponse, ComplaintStatusUpdate

# =====================================
# Router Configuration
# =====================================

router = APIRouter(prefix="/technician", tags=["Technician"])


# =====================================
# Get Current Assigned Complaints
# =====================================


@router.get("/complaints", response_model=list[ComplaintResponse])
def get_assigned_complaints(
    current_user: technician_dependency,
    db: db_dependency,
):
    complaints = (
        db.query(Complaint)
        .filter(Complaint.assigned_to == current_user.id)
        .all()
    )

    return complaints


# =====================================
# Update Complaint Status
# =====================================


@router.put(
    "/update_complaints/{id}", response_model=ComplaintResponse
)
def update_complaint(
    id: int,
    complaint_data: ComplaintStatusUpdate,
    current_user: technician_dependency,
    db: db_dependency,
):
    complaint = db.query(Complaint).filter(Complaint.id == id).first()

    if complaint is None:
        raise HTTPException(
            status_code=404, detail="Complaint not found"
        )

    # Check this complaint belongs to technician
    if complaint.assigned_to != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="This complaint is not assigned to you",
        )

    complaint.status = complaint_data.status

    db.commit()
    db.refresh(complaint)

    return complaint


# =====================================
# Technician History
# =====================================


@router.get("/history", response_model=list[ComplaintResponse])
def technician_history(
    current_user: technician_dependency,
    db: db_dependency,
):
    history = (
        db.query(Complaint)
        .filter(Complaint.assigned_to == current_user.id)
        .all()
    )

    return history