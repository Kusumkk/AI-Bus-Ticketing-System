import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get customer's bookings
  const getBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/api/bookings/");

      setBookings(response.data);
    } catch (error) {
      console.error("Bookings error:", error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail.map((item) => item.msg).join(", ")
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to load bookings.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load bookings when page opens
  useEffect(() => {
    getBookings();
  }, []);

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await API.patch(
        `/api/bookings/${bookingId}/cancel`
      );

      alert("Booking cancelled successfully.");

      // Reload bookings after cancellation
      await getBookings();

    } catch (error) {
      console.error("Cancel booking error:", error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail.map((item) => item.msg).join(", ")
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to cancel booking.");
      }
    }
  };

  return (
    <div className="dashboard">

      {/* Navbar */}
      <nav className="navbar">

        <h2>🚌 AI Bus Ticketing</h2>

        <div>
          <button
            onClick={() => navigate("/customer")}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/ai-search")}
          >
            Search Buses
          </button>
        </div>

      </nav>

      {/* Main Content */}
      <main className="dashboard-content">

        <h1>🎫 My Bookings</h1>

        <p className="dashboard-subtitle">
          View and manage your booked bus tickets.
        </p>

        {/* Loading */}
        {loading && (
          <div className="dashboard-card">
            <h2>Loading bookings...</h2>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="dashboard-card">
            <p className="error-message">
              {error}
            </p>
          </div>
        )}

        {/* No bookings */}
        {!loading &&
          !error &&
          bookings.length === 0 && (
            <div className="dashboard-card empty-state">

              <h2>No bookings yet</h2>

              <p>
                Search for a bus and book your first ticket.
              </p>

              <button
                className="primary-button"
                onClick={() => navigate("/ai-search")}
              >
                Search Buses
              </button>

            </div>
          )}

        {/* Booking Cards */}
        {!loading && bookings.length > 0 && (
          <div className="booking-grid">

            {bookings.map((booking) => (

              <div
                className="booking-card"
                key={booking.id}
              >

                <div className="booking-header">

                  <h3>
                    🎫 Booking #{booking.id}
                  </h3>

                  <span className="booking-status">
                    {booking.status}
                  </span>

                </div>

                <p>
                  <strong>Passenger:</strong>{" "}
                  {booking.passenger_name}
                </p>

                <p>
                  <strong>Age:</strong>{" "}
                  {booking.passenger_age}
                </p>

                <p>
                  <strong>Seat:</strong>{" "}
                  {booking.seat_number}
                </p>

                <p>
                  <strong>Bus ID:</strong>{" "}
                  {booking.bus_id}
                </p>

                <p>
                  <strong>Booked At:</strong>{" "}
                  {booking.created_at}
                </p>

                {/* Cancel button only for active bookings */}
                {booking.status !== "CANCELLED" && (
                  <button
                    className="cancel-button"
                    onClick={() =>
                      cancelBooking(booking.id)
                    }
                  >
                    Cancel Booking
                  </button>
                )}

              </div>

            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default MyBookings;