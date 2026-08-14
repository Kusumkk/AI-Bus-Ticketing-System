from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.bus import Bus
from app.services.ai_service import parse_search_query

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Search"]
)


class AISearchRequest(BaseModel):
    query: str


@router.post("/search")
def ai_search(
    search_data: AISearchRequest,
    db: Session = Depends(get_db)
):
    try:
        filters = parse_search_query(search_data.query)

    except Exception as e:
        print("AI SEARCH ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"AI search error: {str(e)}"
        )

    query = db.query(Bus).filter(
        Bus.status == "AVAILABLE",
        Bus.available_seats > 0
    )

    if filters.get("origin"):
        query = query.filter(
            Bus.origin.ilike(filters["origin"])
        )

    if filters.get("destination"):
        query = query.filter(
            Bus.destination.ilike(filters["destination"])
        )

    if filters.get("bus_type"):
        query = query.filter(
            Bus.bus_type == filters["bus_type"]
        )

    if filters.get("max_price"):
        query = query.filter(
            Bus.price <= filters["max_price"]
        )

    buses = query.all()

    return {
        "interpreted_query": filters,
        "results": buses
    }