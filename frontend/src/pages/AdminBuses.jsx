import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function AdminBuses() {
  const navigate = useNavigate();

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);

  const [formData, setFormData] = useState({
    bus_number: "",
    origin: "",
    destination: "",
    departure_time: "",
    bus_type: "AC",
    total_seats: "",
    price: "",
    status: "AVAILABLE",
  });

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
  // GET ALL BUSES
  // =========================
  const getBuses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/api/buses/");

      setBuses(response.data);
    } catch (error) {
      console.error("Get buses error:", error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail.map((item) => item.msg).join(", ")
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to load buses.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBuses();
  }, []);

  // =========================
  // HANDLE FORM CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setFormData({
      bus_number: "",
      origin: "",
      destination: "",
      departure_time: "",
      bus_type: "AC",
      total_seats: "",
      price: "",
      status: "AVAILABLE",
    });

    setEditingBus(null);
    setShowForm(false);
  };

  // =========================
  // CREATE / UPDATE BUS
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const busData = {
        bus_number: formData.bus_number,
        origin: formData.origin,
        destination: formData.destination,

        departure_time: new Date(
          formData.departure_time
        ).toISOString(),

        bus_type: formData.bus_type,

        total_seats: Number(
          formData.total_seats
        ),

        price: Number(formData.price),

        status: formData.status,
      };

      // UPDATE
      if (editingBus) {
        await API.put(
          `/api/buses/${editingBus.id}`,
          busData
        );

        alert("Bus updated successfully.");
      }

      // CREATE
      else {
        await API.post(
          "/api/buses/",
          busData
        );

        alert("Bus created successfully.");
      }

      resetForm();

      await getBuses();

    } catch (error) {
      console.error(
        "Save bus error:",
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
          "Unable to save bus."
        );
      }
    }
  };

  // =========================
  // EDIT BUS
  // =========================
  const handleEdit = (bus) => {
    setEditingBus(bus);

    const date = new Date(
      bus.departure_time
    );

    const localDateTime =
      date.toISOString().slice(0, 16);

    setFormData({
      bus_number:
        bus.bus_number || "",

      origin:
        bus.origin || "",

      destination:
        bus.destination || "",

      departure_time:
        localDateTime,

      bus_type:
        bus.bus_type || "AC",

      total_seats:
        bus.total_seats || "",

      price:
        bus.price || "",

      status:
        bus.status || "AVAILABLE",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE BUS
  // =========================
  const handleDelete = async (busId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this bus?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await API.delete(
        `/api/buses/${busId}`
      );

      alert(
        "Bus deleted successfully."
      );

      await getBuses();

    } catch (error) {
      console.error(
        "Delete bus error:",
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
          "Unable to delete bus."
        );
      }
    }
  };

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
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =====================
          MAIN CONTENT
      ====================== */}

      <main className="dashboard-content">

        {/* PAGE HEADER */}

        <div className="page-header">

          <div>

            <h1>
              🚌 Manage Buses
            </h1>

            <p className="dashboard-subtitle">
              Add, edit and remove buses
              from the system.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() => {

              if (showForm) {
                resetForm();
              } else {
                setEditingBus(null);
                setShowForm(true);
              }

            }}
          >
            {showForm
              ? "Close Form"
              : "+ Add Bus"}
          </button>

        </div>

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
            ADD / EDIT FORM
        ====================== */}

        {showForm && (

          <div
            className="
              dashboard-card
              admin-form-card
            "
          >

            <h2>

              {editingBus
                ? "✏️ Edit Bus"
                : "➕ Add New Bus"}

            </h2>

            <form
              className="admin-bus-form"
              onSubmit={handleSubmit}
            >

              {/* BUS NUMBER */}

              <div className="form-group">

                <label>
                  Bus Number
                </label>

                <input
                  type="text"
                  name="bus_number"
                  placeholder="TS01AB1234"
                  value={
                    formData.bus_number
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* ORIGIN */}

              <div className="form-group">

                <label>
                  Origin
                </label>

                <input
                  type="text"
                  name="origin"
                  placeholder="Hyderabad"
                  value={
                    formData.origin
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* DESTINATION */}

              <div className="form-group">

                <label>
                  Destination
                </label>

                <input
                  type="text"
                  name="destination"
                  placeholder="Bangalore"
                  value={
                    formData.destination
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* DEPARTURE */}

              <div className="form-group">

                <label>
                  Departure Time
                </label>

                <input
                  type="datetime-local"
                  name="departure_time"
                  value={
                    formData.departure_time
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* BUS TYPE */}

              <div className="form-group">

                <label>
                  Bus Type
                </label>

                <select
                  name="bus_type"
                  value={
                    formData.bus_type
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="AC">
                    AC
                  </option>

                  <option value="NON_AC">
                    Non-AC
                  </option>

                  <option value="SLEEPER">
                    Sleeper
                  </option>

                  <option value="SEATER">
                    Seater
                  </option>

                </select>

              </div>

              {/* TOTAL SEATS */}

              <div className="form-group">

                <label>
                  Total Seats
                </label>

                <input
                  type="number"
                  name="total_seats"
                  placeholder="40"
                  min="1"
                  value={
                    formData.total_seats
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* PRICE */}

              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="850"
                  min="0"
                  step="0.01"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="AVAILABLE">
                    AVAILABLE
                  </option>

                  <option value="CANCELLED">
                    CANCELLED
                  </option>

                </select>

              </div>

              {/* ACTIONS */}

              <div className="form-actions">

                <button
                  type="submit"
                  className="primary-button"
                >

                  {editingBus
                    ? "Update Bus"
                    : "Create Bus"}

                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}

        {/* =====================
            BUS LIST
        ====================== */}

        <div className="dashboard-card">

          <h2>
            All Buses
          </h2>

          {loading ? (

            <p>
              Loading buses...
            </p>

          ) : buses.length === 0 ? (

            <p className="empty-state">
              No buses available.
            </p>

          ) : (

            <div className="admin-bus-table">

              <table>

                <thead>

                  <tr>

                    <th>
                      Bus Number
                    </th>

                    <th>
                      Route
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Departure
                    </th>

                    <th>
                      Seats
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {buses.map((bus) => (

                    <tr key={bus.id}>

                      {/* BUS NUMBER */}

                      <td>

                        <strong>
                          {bus.bus_number}
                        </strong>

                      </td>

                      {/* ROUTE */}

                      <td>
                        {bus.origin}
                        {" → "}
                        {bus.destination}
                      </td>

                      {/* TYPE */}

                      <td>
                        {bus.bus_type}
                      </td>

                      {/* DEPARTURE */}

                      <td>

                        {new Date(
                          bus.departure_time
                        ).toLocaleString()}

                      </td>

                      {/* SEATS */}

                      <td>

                        {bus.available_seats}
                        {" / "}
                        {bus.total_seats}

                      </td>

                      {/* PRICE */}

                      <td>
                        ₹{bus.price}
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className="bus-status"
                        >
                          {bus.status}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEdit(bus)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(
                              bus.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default AdminBuses;