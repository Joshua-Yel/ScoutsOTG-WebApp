import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [editTour, setEditTour] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imgUrl: "",
  });

  useEffect(() => {
    if (isAdmin) {
      fetchBookings();
      fetchTours();
    }
  }, [isAdmin]);

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const bookingsSnap = await getDocs(bookingsRef);
      const bookingsList = bookingsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsList);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchTours = async () => {
    try {
      const toursCollection = collection(db, "tours");
      const toursSnapshot = await getDocs(toursCollection);
      const toursList = toursSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTours(toursList);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await deleteDoc(doc(db, "bookings", id));
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== id)
      );
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const bookingDoc = doc(db, "bookings", id);
      await updateDoc(bookingDoc, { status });
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleDeleteTour = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this tour?"
      );
      if (!confirmDelete) {
        return;
      }

      const tourDocRef = doc(db, "tours", id);
      await deleteDoc(tourDocRef);
      setTours((prevTours) => prevTours.filter((tour) => tour.id !== id));
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  const handleEditTour = (id) => {
    const tour = tours.find((tour) => tour.id === id);
    setFormData(tour);
    setEditTour(id);
  };

  const handleSaveTour = async (id) => {
    try {
      const tourDocRef = doc(db, "tours", id);
      await updateDoc(tourDocRef, formData);
      setEditTour(null);
      fetchTours(); // Refresh the tours list
    } catch (error) {
      console.error("Error updating tour:", error);
    }
  };

  const handleCreateTourClick = () => {
    navigate("/create-tour");
  };

  if (!isAdmin) {
    return <p>You do not have permission to view this page.</p>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Page</h2>
      <section className="admin-section">
        <h2>Manage Bookings</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tour Title</th>
              <th>Pax</th>
              <th>Dates</th>
              <th>Pickup Time</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.tourTitle}</td>
                <td>{booking.pax}</td>
                <td>{`From ${new Date(booking.selectedDates[0]).toLocaleDateString()} to ${new Date(booking.selectedDates[1]).toLocaleDateString()}`}</td>
                <td>{booking.selectedTime}</td>
                <td>{booking.paymentMethod}</td>
                <td>{booking.status}</td>
                <td className="actions-cell">
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "Confirmed")}
                    className="btn btn-success"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "Cancelled")}
                    className="btn btn-warning"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => navigate(`/booking-details/${booking.id}`)}
                    className="btn btn-info"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="admin-section">
        <h3>Tours</h3>
        <h2>Manage Posted Tours</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id}>
                <td>{tour.title}</td>
                <td>{tour.price}</td>
                <td className="tour-actions-cell">
                  <button
                    onClick={() => handleEditTour(tour.id)}
                    className="btn btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTour(tour.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleCreateTourClick}
          className="btn btn-primary"
        >
          Create New Tour
        </button>
      </section>

      {editTour && (
        <div className="edit-tour-modal">
          <h3>Edit Tour</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveTour(editTour);
            }}
          >
            <label>
              Title:
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </label>
            <label>
              Description:
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </label>
            <label>
              Image URL:
              <input
                type="text"
                value={formData.imgUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imgUrl: e.target.value })
                }
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save
            </button>
            <button
              onClick={() => setEditTour(null)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
