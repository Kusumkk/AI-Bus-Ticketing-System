from sqlalchemy import Column, Integer, String, Enum, DateTime, Numeric
from sqlalchemy.sql import func

from app.database import Base


class Bus(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    bus_number = Column(String(50), unique=True, nullable=False)
    origin = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    departure_time = Column(DateTime, nullable=False)
    bus_type = Column(Enum("AC", "NON-AC", "SLEEPER"), nullable=False)
    total_seats = Column(Integer, nullable=False)
    available_seats = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    status = Column(
        Enum("AVAILABLE", "UNAVAILABLE"),
        default="AVAILABLE"
    )
    created_at = Column(DateTime, server_default=func.now())