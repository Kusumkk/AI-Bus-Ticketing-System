from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.models.booking import Booking
from app.models.bus import Bus
from app.models.user import User


router = APIRouter(
    prefix="/api/admin/bookings",
    tags=["Admin Bookings"]
)


@router.get("/")
def get_all_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    bookings = (
        db.query(Booking)
        .order_by(Booking.id.desc())
        .all()
    )

    result = []

    for booking in bookings:

        bus = db.query(Bus).filter(
            Bus.id == booking.bus_id
        ).first()

        user = db.query(User).filter(
            User.id == booking.user_id
        ).first()

        result.append({
            "booking_id": booking.id,
            "customer_id": booking.user_id,
            "customer_name": user.name if user else None,
            "customer_email": user.email if user else None,
            "bus_id": booking.bus_id,
            "bus_number": bus.bus_number if bus else None,
            "route": (
                f"{bus.origin} → {bus.destination}"
                if bus else None
            ),
            "passenger_name": booking.passenger_name,
            "passenger_age": booking.passenger_age,
            "seat_number": booking.seat_number,
            "amount": booking.amount,
            "status": booking.status,
            "created_at": booking.created_at
        })

    return result