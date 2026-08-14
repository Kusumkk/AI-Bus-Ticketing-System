from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.bus import Bus
from app.schemas.bus import BusCreate, BusUpdate
from app.dependencies import require_admin

router = APIRouter(prefix="/api/buses", tags=["Buses"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_bus(
    bus_data: BusCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    existing_bus = db.query(Bus).filter(
        Bus.bus_number == bus_data.bus_number
    ).first()

    if existing_bus:
        raise HTTPException(
            status_code=400,
            detail="Bus number already exists"
        )

    bus = Bus(
        bus_number=bus_data.bus_number,
        origin=bus_data.origin,
        destination=bus_data.destination,
        departure_time=bus_data.departure_time,
        bus_type=bus_data.bus_type,
        total_seats=bus_data.total_seats,
        available_seats=bus_data.total_seats,
        price=bus_data.price,
        status=bus_data.status
    )

    db.add(bus)
    db.commit()
    db.refresh(bus)

    return bus


@router.get("/")
def get_buses(db: Session = Depends(get_db)):
    return db.query(Bus).all()


@router.get("/search")
def search_buses(
    origin: str,
    destination: str,
    bus_type: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Bus).filter(
        Bus.origin.ilike(origin),
        Bus.destination.ilike(destination),
        Bus.status == "AVAILABLE",
        Bus.available_seats > 0
    )

    if bus_type:
        query = query.filter(
            Bus.bus_type == bus_type.upper()
        )

    return query.all()


@router.get("/{bus_id}")
def get_bus(
    bus_id: int,
    db: Session = Depends(get_db)
):
    bus = db.query(Bus).filter(
        Bus.id == bus_id
    ).first()

    if not bus:
        raise HTTPException(
            status_code=404,
            detail="Bus not found"
        )

    return bus


@router.put("/{bus_id}")
def update_bus(
    bus_id: int,
    bus_data: BusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    bus = db.query(Bus).filter(
        Bus.id == bus_id
    ).first()

    if not bus:
        raise HTTPException(
            status_code=404,
            detail="Bus not found"
        )

    update_data = bus_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(bus, key, value)

    db.commit()
    db.refresh(bus)

    return bus


@router.delete("/{bus_id}")
def delete_bus(
    bus_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    bus = db.query(Bus).filter(
        Bus.id == bus_id
    ).first()

    if not bus:
        raise HTTPException(
            status_code=404,
            detail="Bus not found"
        )

    db.delete(bus)
    db.commit()

    return {
        "message": "Bus deleted successfully"
    }