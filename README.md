# AI Bus Ticketing System

## Tech Stack Used

- **Frontend:** React.js, JavaScript, CSS
- **Backend:** Python, FastAPI
- **Database:** MySQL
- **Authentication:** JWT

## Architecture Decisions

The system follows a **client-server architecture**:

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    │      / Admin        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │       FastAPI       │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       Authentication      Bus/Booking       AI Search
          & Roles             APIs             Logic
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │      Database       │
                    └─────────────────────┘
```

* React is used for the customer and admin interfaces.
* FastAPI handles REST APIs, authentication, bus management, booking logic, and validation.
* MySQL stores users, buses, and bookings.
* JWT is used for authentication and role-based access.
* Booking validation is handled on the backend to prevent duplicate bookings and overbooking.
* Seat availability is decreased after a confirmed booking and restored when a booking is cancelled.

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Kusumkk/AI-Bus-Ticketing-System.git
cd AI-Bus-Ticketing-System
```

### 2. Database

Create a MySQL database and execute:

```text
database/schema.sql
```

### 3. Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env` using `.env.example` and configure the required database and secret values.

Start the backend:

```powershell
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### 4. Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Assumptions

* Each confirmed booking occupies one seat.
* A seat cannot be booked twice for the same bus.
* A bus with zero available seats cannot accept new bookings.
* Cancelling a booking releases the occupied seat.
* Ticket price is based on the selected bus.
* MySQL is used as the development database.
* Authentication secrets and database credentials are stored in environment variables.
* Payment gateway integration is outside the current project scope.
