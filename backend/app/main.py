from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.routes.auth import router as auth_router
from app.routes.buses import router as buses_router
from app.routes.bookings import router as bookings_router
from app.routes.ai_search import router as ai_search_router
from app.routes.admin import router as admin_router
from app.routes.admin_bookings import router as admin_bookings_router



app = FastAPI(
    title="AI Bus Ticketing System",
    description="AI-powered bus ticket search and booking API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(buses_router)
app.include_router(bookings_router)
app.include_router(ai_search_router)
app.include_router(admin_router)
app.include_router(admin_bookings_router)


@app.get("/")
def root():
    return {
        "message": "AI Bus Ticketing System API is running"
    }


@app.get("/health")
def health_check():
    try:
        with engine.connect():
            return {
                "status": "healthy",
                "database": "connected"
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }