from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    bus_id: int
    passenger_name: str
    passenger_age: int = Field(gt=0)
    seat_number: int = Field(gt=0)