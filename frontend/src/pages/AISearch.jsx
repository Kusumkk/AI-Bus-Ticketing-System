import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function AISearch() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [buses, setBuses] = useState([]);
  const [interpretedQuery, setInterpretedQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBuses = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please describe your travel requirement.");
      return;
    }

    setLoading(true);
    setError("");
    setBuses([]);

    try {
      const response = await API.post("/api/ai/search", {
        query: query,
      });

      setBuses(response.data.results || []);
      setInterpretedQuery(response.data.interpreted_query);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Unable to search for buses."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      <nav className="navbar">
        <h2>🚌 AI Bus Ticketing</h2>

        <div>
          <button onClick={() => navigate("/customer")}>
            Home
          </button>

          <button onClick={() => navigate("/my-bookings")}>
            My Bookings
          </button>
        </div>
      </nav>

      <main className="dashboard-content">

        <h1>🤖 AI-Powered Bus Search</h1>

        <p className="dashboard-subtitle">
          Describe your travel requirement naturally and let AI
          find matching buses.
        </p>

        <div className="dashboard-card">

          <form onSubmit={searchBuses}>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Example: "I need an AC bus from Hyderabad to Bangalore tomorrow morning"'
              rows="4"
            />

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Searching..." : "🔍 Search with AI"}
            </button>

          </form>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

        </div>

        {interpretedQuery && (
          <div className="dashboard-card">

            <h2>AI Interpreted Search</h2>

            <div className="interpreted-query">

              {interpretedQuery.origin && (
                <span>
                  📍 From: {interpretedQuery.origin}
                </span>
              )}

              {interpretedQuery.destination && (
                <span>
                  📍 To: {interpretedQuery.destination}
                </span>
              )}

              {interpretedQuery.bus_type && (
                <span>
                  🚌 Type: {interpretedQuery.bus_type}
                </span>
              )}

              {interpretedQuery.max_price && (
                <span>
                  💰 Max Price: ₹{interpretedQuery.max_price}
                </span>
              )}

            </div>

          </div>
        )}

        <div>

          <h2 className="results-title">
            Available Buses
          </h2>

          {buses.length === 0 && !loading && (
            <div className="empty-state">
              No buses found. Try a different search.
            </div>
          )}

          <div className="bus-grid">

            {buses.map((bus) => (

              <div
                className="bus-card"
                key={bus.id}
              >

                <h3>
                  🚌 {bus.bus_number}
                </h3>

                <p>
                  <strong>
                    {bus.origin}
                  </strong>
                  {" → "}
                  <strong>
                    {bus.destination}
                  </strong>
                </p>

                <p>
                  🕐 Departure: {bus.departure_time}
                </p>

                <p>
                  ❄️ Type: {bus.bus_type}
                </p>

                <p>
                  💺 Available Seats: {bus.available_seats}
                </p>

                <p className="bus-price">
                  ₹{bus.price}
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    navigate(`/book/${bus.id}`)
                  }
                >
                  Book Ticket
                </button>

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AISearch;