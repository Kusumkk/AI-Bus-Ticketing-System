from sqlalchemy import Column, Integer, String, Enum, DateTime, Numeric, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    bus_id = Column(
        Integer,
        ForeignKey("buses.id"),
        nullable=False
    )

    passenger_name = Column(String(100), nullable=False)
    passenger_age = Column(Integer, nullable=False)
    seat_number = Column(Integer, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)

    status = Column(
        Enum("CONFIRMED", "CANCELLED"),
        default="CONFIRMED"
    )

    created_at = Column(DateTime, server_default=func.now())