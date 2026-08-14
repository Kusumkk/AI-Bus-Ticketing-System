import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function BookTicket() {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [loadingBus, setLoadingBus] = useState(true);

  const [formData, setFormData] = useState({
    passenger_name: "",
    passenger_age: "",
    seat_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getBus = async () => {
      try {
        setLoadingBus(true);
        setError("");

        const response = await API.get(
          `/api/buses/${Number(busId)}`
        );

        setBus(response.data);
      } catch (error) {
        console.error("Bus loading error:", error);

        const detail = error.response?.data?.detail;

        if (Array.isArray(detail)) {
          setError(
            detail.map((item) => item.msg).join(", ")
          );
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Unable to load bus details.");
        }
      } finally {
        setLoadingBus(false);
      }
    };

    getBus();
  }, [busId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await API.post(
        "/api/bookings/",
        {
          bus_id: Number(busId),
          passenger_name: formData.passenger_name,
          passenger_age: Number(formData.passenger_age),
          seat_number: Number(formData.seat_number),
        }
      );

      console.log("Booking response:", response.data);

      alert("Ticket booked successfully!");

      navigate("/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail.map((item) => item.msg).join(", ")
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Booking failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingBus) {
    return (
      <div className="dashboard">
        <main className="dashboard-content">
          <div className="dashboard-card">
            <h2>Loading bus details...</h2>
          </div>
        </main>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="dashboard">
        <main className="dashboard-content">
          <div className="dashboard-card">
            <h2>Unable to load bus</h2>

            <p className="error-message">
              {typeof error === "string"
                ? error
                : "Unable to load bus details."}
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/ai-search")}
            >
              Back to Search
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <nav className="navbar">
        <h2>🚌 AI Bus Ticketing</h2>

        <div>
          <button
            onClick={() => navigate("/customer")}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </button>
        </div>
      </nav>

      <main className="dashboard-content">

        <h1>🎫 Book Your Ticket</h1>

        <div className="booking-layout">

          {/* Bus Details */}
          <div className="dashboard-card">

            <h2>Bus Details</h2>

            <p>
              <strong>Bus Number:</strong>{" "}
              {bus.bus_number}
            </p>

            <p>
              <strong>Route:</strong>{" "}
              {bus.origin} → {bus.destination}
            </p>

            <p>
              <strong>Bus Type:</strong>{" "}
              {bus.bus_type}
            </p>

            <p>
              <strong>Departure:</strong>{" "}
              {bus.departure_time}
            </p>

            <p>
              <strong>Available Seats:</strong>{" "}
              {bus.available_seats}
            </p>

            <p className="bus-price">
              ₹{bus.price}
            </p>

          </div>

          {/* Passenger Details */}
          <div className="dashboard-card">

            <h2>Passenger Details</h2>

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            <form
              onSubmit={handleBooking}
              className="booking-form"
            >

              <input
                type="text"
                name="passenger_name"
                placeholder="Passenger Name"
                value={formData.passenger_name}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="passenger_age"
                placeholder="Passenger Age"
                min="1"
                max="120"
                value={formData.passenger_age}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="seat_number"
                placeholder="Seat Number"
                min="1"
                max={bus.total_seats}
                value={formData.seat_number}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Booking..."
                  : "Confirm Booking"}
              </button>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
}

export default BookTicket;