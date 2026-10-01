from fastapi import APIRouter, HTTPException
from dependencies import db_dependency, user_dependency
from models import Complaint
from schemas import ComplaintStatusUpdate

# =====================================
# Router Configuration
# =====================================

router = APIRouter(prefix="/technician", tags=["Technician"])


# =====================================
# Get Current Assigned Complaints
# =====================================


@router.get("/complaints")
def get_assigned_complaints(
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "technician":
        raise HTTPException(status_code=403, detail="Permission denied")

    complaints = (
        db.query(Complaint)
        .filter(Complaint.assigned_to == current_user["id"])
        .all()
    )

    return complaints


# =====================================
# Update Complaint Status
# =====================================


@router.put("/update_complaints/{id}")
def update_complaint(
    id: int,
    complaint_data: ComplaintStatusUpdate,
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "technician":
        raise HTTPException(status_code=403, detail="Permission denied")

    complaint = db.query(Complaint).filter(Complaint.id == id).first()

    if complaint is None:
        raise HTTPException(
            status_code=404, detail="Complaint not found"
        )

    # Check this complaint belongs to technician
    if complaint.assigned_to != current_user["id"]:
        raise HTTPException(
            status_code=403,
            detail="This complaint is not assigned to you",
        )

    update_data = complaint_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(complaint, key, value)

    db.commit()
    db.refresh(complaint)

    return complaint


# =====================================
# Technician History
# =====================================


@router.get("/history")
def technician_history(
    current_user: user_dependency,
    db: db_dependency,
):
    if current_user["role"] != "technician":
        raise HTTPException(status_code=403, detail="Permission denied")

    history = (
        db.query(Complaint)
        .filter(Complaint.assigned_to == current_user["id"])
        .all()
    )

    return history