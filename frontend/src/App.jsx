import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import AISearch from "./pages/AISearch";
import MyBookings from "./pages/MyBookings";
import BookTicket from "./pages/BookTicket";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBuses from "./pages/AdminBuses";
import AdminBookings from "./pages/AdminBookings";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/customer"
          element={<CustomerDashboard />}
        />

        <Route
          path="/ai-search"
          element={<AISearch />}
        />

        <Route
  path="/book/:busId"
  element={<BookTicket />}
/>

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
  path="/admin/buses"
  element={<AdminBuses />}
/>
<Route
  path="/admin/bookings"
  element={<AdminBookings />}
/>


      </Routes>

    </BrowserRouter>
  );
}

export default App;