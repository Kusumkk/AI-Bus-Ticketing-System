from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_customer
from app.models.booking import Booking
from app.models.bus import Bus
from app.models.user import User
from app.schemas.booking import BookingCreate

router = APIRouter(
    prefix="/api/bookings",
    tags=["Bookings"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer)
):
    bus = db.query(Bus).filter(
        Bus.id == booking_data.bus_id
    ).first()

    if not bus:
        raise HTTPException(
            status_code=404,
            detail="Bus not found"
        )

    if bus.status != "AVAILABLE":
        raise HTTPException(
            status_code=400,
            detail="Bus is not available"
        )

    if bus.available_seats <= 0:
        raise HTTPException(
            status_code=409,
            detail="No seats available"
        )

    if booking_data.seat_number > bus.total_seats:
        raise HTTPException(
            status_code=400,
            detail="Invalid seat number"
        )

    existing_seat = db.query(Booking).filter(
        Booking.bus_id == booking_data.bus_id,
        Booking.seat_number == booking_data.seat_number,
        Booking.status == "CONFIRMED"
    ).first()

    if existing_seat:
        raise HTTPException(
            status_code=409,
            detail="Seat already booked"
        )

    booking = Booking(
        user_id=current_user.id,
        bus_id=bus.id,
        passenger_name=booking_data.passenger_name,
        passenger_age=booking_data.passenger_age,
        seat_number=booking_data.seat_number,
        amount=bus.price,
        status="CONFIRMED"
    )

    bus.available_seats -= 1

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking


@router.get("/")
def get_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer)
):
    return db.query(Booking).filter(
        Booking.user_id == current_user.id
    ).all()


@router.patch("/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only cancel your own booking"
        )

    if booking.status == "CANCELLED":
        raise HTTPException(
            status_code=400,
            detail="Booking is already cancelled"
        )

    bus = db.query(Bus).filter(
        Bus.id == booking.bus_id
    ).first()

    if not bus:
        raise HTTPException(
            status_code=404,
            detail="Bus not found"
        )

    booking.status = "CANCELLED"
    bus.available_seats += 1

    db.commit()
    db.refresh(booking)

    return {
        "message": "Booking cancelled successfully",
        "booking_id": booking.id,
        "status": booking.status,
        "available_seats": bus.available_seats
    }