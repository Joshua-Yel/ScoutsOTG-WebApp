import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import DeleteIcon from "../assets/delete.svg";
import Slider from "react-slick";
import headerimg from "../assets/header4.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

export default function Home() {
  const { isAdmin } = useAuth();
  const [tours, setArticles] = useState(null);

  const scrollToSection = () => {
    const section = document.getElementById("services");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchArticles = useCallback(async () => {
    try {
      const ref = collection(db, "tours");
      const snapshot = await getDocs(ref);
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setArticles(results);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  }, []);

  useEffect(() => {
    if (!tours) {
      fetchArticles();
    }
  }, [tours, fetchArticles]);

  const handleDelete = async (id) => {
    try {
      const ref = doc(db, "tours", id);
      await deleteDoc(ref);
      setArticles(tours.filter((tour) => tour.id !== id));
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>
            <strong>Explore the World with Us</strong>
          </h1>
          <p>Discover amazing places at exclusive deals</p>
          <button
            className="arrow-down"
            onClick={scrollToSection}
          >
            <div className="arrows-container">
              <div className="arrow arrow-one"></div>
              <div className="arrow arrow-two"></div>
              <div className="arrow arrow-three"></div>
            </div>
          </button>
        </div>
        <img
          src={headerimg}
          alt="Travel"
          className="hero-image"
        />
      </section>

      <section
        id="services"
        className="services"
      >
        <h2>Our Services</h2>
        <div className="services-list">
          <div className="service-item">
            <img
              src="https://img.icons8.com/?size=500&id=11551&format=png&color=000000"
              alt="Tour Packages"
              className="service-icon"
            />
            <h3>Tour Packages</h3>
            <p>Customized tours to fit your needs and budget</p>
          </div>
          <div className="service-item">
            <img
              src="https://img.icons8.com/?size=500&id=10662&format=png&color=000000"
              alt="Transportation Services"
              className="service-icon"
            />
            <h3>Transportation Services</h3>
            <p>Competitive prices for domestic Transportation Services</p>
          </div>
          <div className="service-item">
            <img
              src="https://img.icons8.com/?size=500&id=3876&format=png&color=000000"
              alt="Accommodation Reservations"
              className="service-icon"
            />
            <h3>Accommodation Reservations</h3>
            <p>Comfortable stays at the best prices</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Clients Say</h2>
        <Slider
          {...sliderSettings}
          className="testimonials-list"
        >
          <div className="testimonial-item">
            <p>"Amazing experience, highly recommended!" - John Doe</p>
          </div>
          <div className="testimonial-item">
            <p>"Great service and friendly staff!" - Jane Smith</p>
          </div>
          <div className="testimonial-item">
            <p>"Will definitely book again!" - Sarah Lee</p>
          </div>
          <div className="testimonial-item">
            <p>"Will definitely book again!" - Sarah Lee</p>
          </div>
          <div className="testimonial-item">
            <p>"Will definitely book again!" - Sarah Lee</p>
          </div>
          <div className="testimonial-item">
            <p>"Will definitely book again!" - Sarah Lee</p>
          </div>
          <div className="testimonial-item">
            <p>"Will definitely book again!" - Sarah Lee</p>
          </div>
        </Slider>
      </section>

      {/* <section className="featured-tours">
        <h2>Featured Tours</h2>
        <div className="tours-list">
          {tours &&
            tours.map((tour) => (
              <div key={tour.id} className="card">
                <h3>{tour.title}</h3>
                <p>Written by {tour.price}</p>
                <Link to={`/tours/${tour.id}`}>Read More...</Link>
                {isAdmin && (
                  <img
                    className="icon"
                    onClick={() => handleDelete(tour.id)}
                    src={DeleteIcon}
                    alt="delete icon"
                  />
                )}
              </div>
            ))}
        </div>
      </section> */}

      <footer>
        <p>&copy; 2024 Travel Scouts OTG. All rights reserved.</p>
      </footer>
    </main>
  );
}
