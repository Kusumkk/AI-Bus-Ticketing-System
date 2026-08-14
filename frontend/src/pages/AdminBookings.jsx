import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  // =========================
  // GET ALL BOOKINGS
  // =========================
  const getBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/api/admin/bookings/"
      );

      console.log(
        "Admin bookings:",
        response.data
      );

      setBookings(response.data);

    } catch (error) {
      console.error(
        "Admin bookings error:",
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
          "Unable to load admin bookings."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div className="dashboard">

      {/* =====================
          NAVBAR
      ====================== */}

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

      {/* =====================
          MAIN CONTENT
      ====================== */}

      <main className="dashboard-content">

        <h1>
          🎫 Manage Bookings
        </h1>

        <p className="dashboard-subtitle">
          View all customer bookings.
        </p>

        {/* =====================
            LOADING
        ====================== */}

        {loading && (
          <div className="dashboard-card">

            <h2>
              Loading bookings...
            </h2>

          </div>
        )}

        {/* =====================
            ERROR
        ====================== */}

        {error && (
          <div className="dashboard-card">

            <p className="error-message">
              {error}
            </p>

          </div>
        )}

        {/* =====================
            NO BOOKINGS
        ====================== */}

        {!loading &&
          !error &&
          bookings.length === 0 && (

            <div className="dashboard-card">

              <h2>
                No bookings found
              </h2>

              <p>
                There are currently no
                customer bookings.
              </p>

            </div>
          )}

        {/* =====================
            BOOKINGS TABLE
        ====================== */}

        {!loading &&
          bookings.length > 0 && (

            <div className="dashboard-card">

              <div className="admin-booking-table">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Booking ID
                      </th>

                      <th>
                        Customer
                      </th>

                      <th>
                        Bus
                      </th>

                      <th>
                        Route
                      </th>

                      <th>
                        Passenger
                      </th>

                      <th>
                        Seat
                      </th>

                      <th>
                        Amount
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Booked At
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {bookings.map(
                      (booking) => (

                        <tr
                          key={
                            booking.booking_id
                          }
                        >

                          {/* BOOKING ID */}

                          <td>

                            <strong>
                              #
                              {
                                booking.booking_id
                              }
                            </strong>

                          </td>

                          {/* CUSTOMER */}

                          <td>

                            <strong>
                              {
                                booking.customer_name
                              }
                            </strong>

                            <br />

                            <small>
                              {
                                booking.customer_email
                              }
                            </small>

                          </td>

                          {/* BUS */}

                          <td>
                            {
                              booking.bus_number
                            }
                          </td>

                          {/* ROUTE */}

                          <td>
                            {booking.route}
                          </td>

                          {/* PASSENGER */}

                          <td>

                            {
                              booking.passenger_name
                            }

                            <br />

                            <small>
                              Age:{" "}
                              {
                                booking.passenger_age
                              }
                            </small>

                          </td>

                          {/* SEAT */}

                          <td>
                            {
                              booking.seat_number
                            }
                          </td>

                          {/* AMOUNT */}

                          <td>
                            ₹
                            {
                              booking.amount
                            }
                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={
                                booking.status ===
                                "CANCELLED"
                                  ? "booking-status cancelled"
                                  : "booking-status"
                              }
                            >
                              {
                                booking.status
                              }
                            </span>

                          </td>

                          {/* BOOKED AT */}

                          <td>

                            {new Date(
                              booking.created_at
                            ).toLocaleString()}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

      </main>

    </div>
  );
}

export default AdminBookings;