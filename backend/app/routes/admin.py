from datetime import datetime, date, time

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.models.booking import Booking
from app.models.bus import Bus
from app.models.user import User


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Dashboard"]
)


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    today = date.today()

    start_of_day = datetime.combine(
        today,
        time.min
    )

    end_of_day = datetime.combine(
        today,
        time.max
    )

    # Total bookings today
    total_bookings_today = db.query(
        func.count(Booking.id)
    ).filter(
        Booking.created_at >= start_of_day,
        Booking.created_at <= end_of_day,
        Booking.status == "CONFIRMED"
    ).scalar()

    # Total revenue
    revenue = db.query(
        func.coalesce(func.sum(Booking.amount), 0)
    ).filter(
        Booking.status == "CONFIRMED"
    ).scalar()

    # Bus occupancy
    buses = db.query(Bus).all()

    bus_occupancy = []

    for bus in buses:
        booked_seats = bus.total_seats - bus.available_seats

        occupancy_rate = (
            booked_seats / bus.total_seats
        ) * 100 if bus.total_seats > 0 else 0

        bus_occupancy.append({
            "bus_id": bus.id,
            "bus_number": bus.bus_number,
            "route": f"{bus.origin} → {bus.destination}",
            "total_seats": bus.total_seats,
            "booked_seats": booked_seats,
            "available_seats": bus.available_seats,
            "occupancy_rate": round(
                occupancy_rate,
                2
            )
        })

    # Route-wise demand
    route_demand = db.query(
        Bus.origin,
        Bus.destination,
        func.count(Booking.id).label("total_bookings")
    ).join(
        Booking,
        Booking.bus_id == Bus.id
    ).filter(
        Booking.status == "CONFIRMED"
    ).group_by(
        Bus.origin,
        Bus.destination
    ).all()

    route_data = []

    for route in route_demand:
        route_data.append({
            "origin": route.origin,
            "destination": route.destination,
            "total_bookings": route.total_bookings
        })

    return {
        "total_bookings_today": total_bookings_today,
        "total_revenue": float(revenue),
        "bus_occupancy": bus_occupancy,
        "route_wise_demand": route_data
    }