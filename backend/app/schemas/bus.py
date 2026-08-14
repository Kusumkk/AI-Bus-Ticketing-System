from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


class BusCreate(BaseModel):
    bus_number: str
    origin: str
    destination: str
    departure_time: datetime
    bus_type: Literal["AC", "NON-AC", "SLEEPER"]
    total_seats: int = Field(gt=0)
    price: Decimal = Field(gt=0)
    status: Literal["AVAILABLE", "UNAVAILABLE"] = "AVAILABLE"


class BusUpdate(BaseModel):
    bus_number: str | None = None
    origin: str | None = None
    destination: str | None = None
    departure_time: datetime | None = None
    bus_type: Literal["AC", "NON-AC", "SLEEPER"] | None = None
    total_seats: int | None = Field(default=None, gt=0)
    price: Decimal | None = Field(default=None, gt=0)
    status: Literal["AVAILABLE", "UNAVAILABLE"] | None = None