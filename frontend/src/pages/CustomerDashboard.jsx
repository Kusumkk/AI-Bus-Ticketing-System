import { useNavigate } from "react-router-dom";
import "../App.css";

function CustomerDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
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

          <button onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">

        <h1>Welcome, Customer 👋</h1>

        <p className="dashboard-subtitle">
          Search and book your bus using AI-powered search.
        </p>

        <div className="dashboard-card">

          <h2>🤖 AI Bus Search</h2>

          <p>
            Describe your travel requirement in natural language.
          </p>

          <div className="search-example">
            Example: "I need an AC bus from Hyderabad to Bangalore tomorrow morning"
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/ai-search")}
          >
            Search Buses with AI
          </button>

        </div>

        <div className="dashboard-actions">

          <div className="action-card">
            <h3>🚌 Search Buses</h3>
            <p>Find available buses and ticket prices.</p>

            <button
              onClick={() => navigate("/ai-search")}
            >
              Search
            </button>
          </div>

          <div className="action-card">
            <h3>🎫 My Bookings</h3>
            <p>View your bookings and booking history.</p>

            <button
              onClick={() => navigate("/my-bookings")}
            >
              View Bookings
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}

export default CustomerDashboard;