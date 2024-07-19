import "./Tours.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Tours() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursCollection = collection(db, "tours");
        const toursSnapshot = await getDocs(toursCollection);
        const toursList = toursSnapshot.docs.map((doc) => ({
          docId: doc.id, // Use a different key to store the Firestore document ID
          ...doc.data(),
        }));
        console.log("Tours fetched: ", toursList); // Debugging statement
        setTours(toursList);
      } catch (error) {
        console.error("Error fetching tours: ", error);
      }
    };

    fetchTours();
  }, []);

  return (
    <div>
      <ul className="tour-list">
        {tours.map((tour) => (
          <section
            key={tour.docId}
            className="tour-section"
          >
            <div className="tour-img">
              <img
                className="tours-img"
                src={tour.imageUrl || "https://via.placeholder.com/300x200"}
                alt={`Image of ${tour.title}`}
              />
            </div>
            <div className="tour-informations">
              <h2>{tour.title}</h2>
              <p>Price: {tour.price}</p>
              <p>Duration: {tour.duration}</p>
              <button onClick={() => navigate(`/toursPage/${tour.docId}`)}>
                View
              </button>
            </div>
          </section>
        ))}
      </ul>
    </div>
  );
}
