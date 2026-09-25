from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
# Import routers
from router import (
    admin,
    auth,
    outage,
    portal,
    technician,
)

# =====================================
# Create Database Tables
# =====================================

Base.metadata.create_all(bind=engine)

# =====================================
# FastAPI Application
# =====================================

app = FastAPI(title="Load Shedding & Power Outage Management System")

# =====================================
# CORS Configuration
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bidyut-bondhu.netlify.app",
        "https://bidyut-bondhu.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# Include Routers
# =====================================

app.include_router(auth.router)
app.include_router(technician.router)
app.include_router(admin.router)
app.include_router(outage.router)
app.include_router(portal.router)

# =====================================
# Root API
# =====================================


@app.get("/")
def home():
    return {
        "message": (
            "Load Shedding & Power Outage Management System API Running"
        )
    }
