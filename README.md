# 🚌 AI Bus Ticketing System

An AI-powered full-stack bus ticketing platform that allows customers to search for buses using natural-language queries, view bus details, book tickets, manage bookings, and cancel tickets.

The system also provides an admin portal for managing buses, monitoring bookings, viewing revenue, and checking bus occupancy.

---

## 📌 Project Overview

The AI Bus Ticketing System is designed to simplify bus ticket booking by combining a conversational/natural-language search experience with a traditional ticket booking workflow.

Customers can:

- Register and log in securely
- Search for buses using natural-language queries
- View available buses and their details
- Select a bus and seat
- Enter passenger details
- Confirm a booking
- View their bookings
- Cancel bookings
- Receive proper validation when a seat is already booked

Administrators can:

- Log in through the admin portal
- View booking and revenue statistics
- Monitor bus occupancy
- Create buses
- Update bus information
- Delete buses
- View all customer bookings
- Manage the overall bus inventory

---

## 🚀 Key Features

### 👤 Customer Features

- Customer registration and login
- JWT-based authentication
- Role-based authorization
- AI-powered natural-language bus search
- Bus search by route and other criteria
- Bus details and availability
- Passenger information form
- Seat selection
- Ticket booking
- Automatic seat availability update
- My Bookings page
- Booking cancellation
- Seat restoration after cancellation
- Duplicate seat booking protection

### 👨‍💼 Admin Features

- Admin authentication
- Admin dashboard
- Today's booking statistics
- Today's revenue
- Total bus count
- Bus occupancy monitoring
- Create bus
- Update bus
- Delete bus
- View all customer bookings
- Role-based API protection

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- React Router
- Axios

## Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- JWT Authentication
- OAuth2 Password Bearer

## Database

- MySQL
- SQLAlchemy ORM
- SQL schema provided in `database/schema.sql`

## AI

- AI-powered natural-language search
- Natural-language queries are interpreted and converted into searchable bus criteria

## Development Tools

- Visual Studio Code
- Git
- GitHub
- Thunder Client
- Swagger / OpenAPI

---

# 🏗️ Architecture

The application follows a **client-server architecture** with separate frontend, backend, and database layers.

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
