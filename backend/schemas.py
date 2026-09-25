from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

# =====================================
# User Schema
# =====================================


# User registration
class UserCreate(BaseModel):
    firstname: str
    lastname: str
    username: str
    email: str
    phone: str
    password: str = Field(min_length=6)
    postal_code: Optional[str] = None


# Admin creates technician/admin
class StaffCreate(BaseModel):
    firstname: str
    lastname: str
    username: str
    email: str
    phone: str
    password: str = Field(min_length=6)
    role: Literal["admin", "technician"]
    postal_code: Optional[str] = None


# Update profile
class UserUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    postal_code: Optional[str] = None


# Change password
class PasswordUpdate(BaseModel):
    old_password: str = Field(min_length=6)
    new_password: str = Field(min_length=6)


# User response
class UserResponse(BaseModel):
    id: int
    firstname: str
    lastname: str
    username: str
    email: str
    phone: str
    role: str
    postal_code: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# =====================================
# Area Schema
# =====================================


class AreaCreate(BaseModel):
    area_name: str
    district: str
    postal_code: str


class AreaUpdate(BaseModel):
    area_name: Optional[str] = None
    district: Optional[str] = None
    postal_code: Optional[str] = None


class AreaResponse(BaseModel):
    id: int
    area_name: str
    district: str
    postal_code: str

    class Config:
        from_attributes = True


# =====================================
# Load Shedding Schema
# =====================================


class LoadSheddingCreate(BaseModel):
    postal_code: str
    start_time: datetime
    end_time: datetime
    reason: Optional[str] = None
    status: Optional[
        Literal["Scheduled", "Running", "Completed", "Cancelled"]
    ] = "Scheduled"


class LoadSheddingUpdate(BaseModel):
    postal_code: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    reason: Optional[str] = None
    status: Optional[
        Literal["Scheduled", "Running", "Completed", "Cancelled"]
    ] = None


class LoadSheddingResponse(BaseModel):
    id: int
    postal_code: str
    start_time: datetime
    end_time: datetime
    status: str
    reason: Optional[str]
    created_by: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# =====================================
# Complaint Schema
# =====================================


# User creates complaint
class ComplaintCreate(BaseModel):
    postal_code: str
    title: str
    description: str


# Admin assigns technician
class ComplaintAssign(BaseModel):
    assigned_to: int


# Technician updates status
class ComplaintStatusUpdate(BaseModel):
    status: Literal["Pending", "Assigned", "Processing", "Solved"]


class ComplaintResponse(BaseModel):
    id: int
    user_id: int
    postal_code: str
    title: str
    description: str
    status: str
    assigned_to: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# =====================================
# Outage History Schema
# =====================================


class OutageHistoryCreate(BaseModel):
    postal_code: str
    start_time: datetime
    end_time: Optional[datetime] = None
    reason: Optional[str] = None


class OutageHistoryUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    reason: Optional[str] = None


class OutageHistoryResponse(BaseModel):
    id: int
    postal_code: str
    start_time: datetime
    end_time: Optional[datetime]
    reason: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True