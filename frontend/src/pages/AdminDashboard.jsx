import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await API.get(
          "/api/admin/dashboard"
        );

        console.log(
          "Admin dashboard:",
          response.data
        );

        setDashboard(response.data);

      } catch (error) {
        console.error(
          "Admin dashboard error:",
          error
        );

        const detail =
          error.response?.data?.detail;

        if (Array.isArray(detail)) {
          setError(
            detail
              .map((item) => item.msg)
              .join(", ")
          );
        } else if (
          typeof detail === "string"
        ) {
          setError(detail);
        } else {
          setError(
            "Unable to load admin dashboard."
          );
        }

      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="dashboard">

        <main className="dashboard-content">

          <div className="dashboard-card">

            <h2>
              Loading Admin Dashboard...
            </h2>

          </div>

        </main>

      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="dashboard">

        <main className="dashboard-content">

          <div className="dashboard-card">

            <h2>
              Admin Dashboard
            </h2>

            <p className="error-message">
              {error}
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate("/login")
              }
            >
              Back to Login
            </button>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* Navbar */}
      <nav className="navbar">

        <h2>
          🚌 AI Bus Ticketing - Admin
        </h2>

        <div>

          <button
            onClick={() =>
              navigate("/admin")
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/admin/buses")
            }
          >
            Manage Buses
          </button>

          <button
            onClick={() =>
              navigate("/admin/bookings")
            }
          >
            Manage Bookings
          </button>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>

        </div>

      </nav>

      {/* Main */}
      <main className="dashboard-content">

        <h1>
          👨‍💼 Admin Dashboard
        </h1>

        <p className="dashboard-subtitle">
          Monitor today's bookings, revenue
          and bus occupancy.
        </p>

        {/* Statistics */}
        <div className="admin-stats">

          <div className="stat-card">

            <h3>
              🎫 Today's Bookings
            </h3>

            <p>
              {dashboard?.total_bookings_today ?? 0}
            </p>

          </div>

          <div className="stat-card">

            <h3>
              💰 Today's Revenue
            </h3>

            <p>
              ₹{dashboard?.total_revenue ?? 0}
            </p>

          </div>

          <div className="stat-card">

            <h3>
              🚌 Total Buses
            </h3>

            <p>
              {dashboard?.bus_occupancy?.length ?? 0}
            </p>

          </div>

        </div>

        {/* Bus Occupancy */}
        <div className="dashboard-card">

          <h2>
            🚌 Bus Occupancy
          </h2>

          {dashboard?.bus_occupancy?.length === 0 ? (

            <p className="empty-state">
              No bus occupancy data available.
            </p>

          ) : (

            <div className="occupancy-table">

              <table>

                <thead>

                  <tr>
                    <th>Bus</th>
                    <th>Route</th>
                    <th>Total Seats</th>
                    <th>Booked</th>
                    <th>Available</th>
                    <th>Occupancy</th>
                  </tr>

                </thead>

                <tbody>

                  {dashboard?.bus_occupancy?.map(
                    (bus) => (

                      <tr
                        key={bus.bus_id}
                      >

                        <td>
                          <strong>
                            {bus.bus_number}
                          </strong>
                        </td>

                        <td>
                          {bus.route}
                        </td>

                        <td>
                          {bus.total_seats}
                        </td>

                        <td>
                          {bus.booked_seats}
                        </td>

                        <td>
                          {bus.available_seats}
                        </td>

                        <td>
                          {bus.occupancy_rate}%
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;