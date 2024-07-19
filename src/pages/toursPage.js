import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext"; // Import your Auth context or hook
import "./ToursPage.css";

export default function ToursPage() {
  const { id } = useParams(); // This should be the document ID
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get the current user from Auth context
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        console.log("Fetching tour with document ID:", id);
        const docRef = doc(db, "tours", id); // Ensure this ID is the document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTour(docSnap.data());
        } else {
          setError("Tour not found");
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
        setError("Error fetching tour");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const handleBookingClick = () => {
    if (currentUser) {
      navigate(`/booking-form/${id}`);
    } else {
      navigate("/login");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="tours-page-container">
      <div className="tours-page-details">
        <div className="tours-page-img">
          <img
            src={tour.imageUrl || "https://via.placeholder.com/800x400"}
            alt={`Image of ${tour.title}`}
            className="img-fluid mb-3"
          />
        </div>
        <div className="tours-page-informations">
          <h1 className="tours-page-title">{tour.title}</h1>
          <div className="tours-page-info">
            <p className="info-item">
              <strong>Price:</strong> {tour.price}
            </p>
            <p className="info-item">
              <strong>Duration:</strong> {tour.duration}
            </p>
            <p className="info-item">
              <strong>Location:</strong> {tour.location}
            </p>
            <p className="info-item">
              <strong>Date:</strong> {tour.date}
            </p>
            <p className="info-item">
              <strong>Time:</strong> {tour.time}
            </p>
            <p className="info-item">
              <strong>Inclusions:</strong> {tour.inclusion}
            </p>
            <p className="info-item">
              <strong>Exclusions:</strong> {tour.exclusion}
            </p>
            <p className="info-item">
              <strong>Highlights:</strong> {tour.highlights}
            </p>
          </div>
          <button
            className="tours-page-book-button"
            onClick={handleBookingClick}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
