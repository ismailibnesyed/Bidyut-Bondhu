from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from database import Base

# =====================================
# Area Table
# =====================================


class Area(Base):
    __tablename__ = "areas"

    id = Column(Integer, primary_key=True, index=True)
    area_name = Column(String, nullable=False)
    district = Column(String, nullable=False)
    postal_code = Column(String, unique=True, index=True, nullable=False)

    # One area can have many users
    users = relationship("User", back_populates="area")

    # One area can have many load shedding schedules
    load_sheddings = relationship("LoadShedding", back_populates="area")

    # One area can have many complaints
    complaints = relationship("Complaint", back_populates="area")

    # One area can have many outage history
    outage_histories = relationship("OutageHistory", back_populates="area")


# =====================================
# User Table
# =====================================


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    # user / technician / admin
    role = Column(String, default="user", nullable=False)

    postal_code = Column(
        String, ForeignKey("areas.postal_code"), nullable=True
    )

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationship
    area = relationship("Area", back_populates="users")

    # User created complaints
    complaints = relationship(
        "Complaint",
        foreign_keys="Complaint.user_id",
        back_populates="user",
    )

    # Technician assigned complaints
    assigned_complaints = relationship(
        "Complaint",
        foreign_keys="Complaint.assigned_to",
        back_populates="technician",
    )


# =====================================
# Load Shedding Table
# =====================================


class LoadShedding(Base):
    __tablename__ = "load_shedding"

    id = Column(Integer, primary_key=True, index=True)

    postal_code = Column(
        String,
        ForeignKey("areas.postal_code"),
        nullable=False,
        index=True,
    )

    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(String, default="Scheduled")
    reason = Column(String, nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    area = relationship("Area", back_populates="load_sheddings")


# =====================================
# Complaint Table
# =====================================


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    postal_code = Column(
        String, ForeignKey("areas.postal_code"), nullable=False
    )

    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="Pending")

    # Technician id
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, server_default=func.now())

    area = relationship("Area", back_populates="complaints")

    user = relationship(
        "User", foreign_keys=[user_id], back_populates="complaints"
    )

    technician = relationship(
        "User",
        foreign_keys=[assigned_to],
        back_populates="assigned_complaints",
    )


# =====================================
# Outage History Table
# =====================================


class OutageHistory(Base):
    __tablename__ = "outage_history"

    id = Column(Integer, primary_key=True, index=True)

    postal_code = Column(
        String, ForeignKey("areas.postal_code"), nullable=False
    )

    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    reason = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    area = relationship("Area", back_populates="outage_histories")