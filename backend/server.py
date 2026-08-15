"""Minimal FastAPI backend for the student management frontend.

This app is primarily a frontend-only Vite + React application that uses
local mock data. This backend exists to satisfy the platform's expected
service layout and to provide a health endpoint for the deployment
health check.
"""

import os
from datetime import datetime, timezone

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")

app = FastAPI(title="Student Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

mongo_client: AsyncIOMotorClient | None = None
if MONGO_URL:
    mongo_client = AsyncIOMotorClient(MONGO_URL)


@api_router.get("/")
async def root():
    return {
        "service": "student-management-api",
        "status": "ok",
        "time": datetime.now(timezone.utc).isoformat(),
    }


@api_router.get("/health")
async def health():
    db_ok = False
    if mongo_client is not None and DB_NAME:
        try:
            await mongo_client[DB_NAME].command("ping")
            db_ok = True
        except Exception:
            db_ok = False
    return {"status": "ok", "db": db_ok}


app.include_router(api_router)
