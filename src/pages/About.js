import React, { useState } from "react";
import "./About.css";
import containerOneImg from "../assets/abt-img1.jpg";
import containerTwoImg from "../assets/abt-img2.jpg";
import containerThreeImg from "../assets/abt-img3.jpg";
import logoPlaceholder from "../assets/LOGO_OTG.png";
import img1 from "../assets/abt-img1.jpg";
import img2 from "../assets/abt-img2.jpg";
import img3 from "../assets/abt-img3.jpg";
import img4 from "../assets/about-img4.jpg";
import img5 from "../assets/about-img5.JPG";
import img6 from "../assets/about-img6.jpg";
import img7 from "../assets/about-img7.jpg";
import img8 from "../assets/about-img8.jpg";

export default function About() {
  const [enlargedImg, setEnlargedImg] = useState(null);

  const handleImageClick = (imgSrc) => {
    setEnlargedImg(imgSrc === enlargedImg ? null : imgSrc);
  };

  const handleBackgroundClick = () => {
    setEnlargedImg(null);
  };

  return (
    <div className="about-container">
      <h1>About Us</h1>
      <div className="row">
        <div className="col-sm-4 about-header">
          <img
            src={logoPlaceholder}
            alt="Company Logo"
            className="logo"
          />
        </div>
        <div className="col about-content">
          <p className="about-description">
            <strong>Scout OTG</strong> is a leading travel agency known for our
            exceptional service and commitment to providing unforgettable travel
            experiences. With a reputation for excellence, we offer a range of
            travel options and services designed to meet your needs and exceed
            your expectations.
          </p>
          <p className="about-description">
            Our mission is to ensure that every journey with us is enjoyable,
            safe, and memorable. Our core values include:
          </p>
          <ul className="about-description-list">
            <li>Creating memorable and enjoyable travel experiences.</li>
            <li>Offering a variety of travel options and packages.</li>
            <li>
              Providing safe travel supplies and comfortable accommodations.
            </li>
            <li>Offering delicious and extraordinary food experiences.</li>
            <li>Encouraging clients to explore and enjoy their travels.</li>
            <li>Increasing client satisfaction and loyalty.</li>
          </ul>
        </div>
        <div className="about-sections">
          <div className="section">
            <div className="section-text">
              <h2>
                Our <br /> Vision
              </h2>
              <p>
                We strive to be the most trusted and innovative travel agency,
                constantly evolving to meet the needs of our clients and
                delivering exceptional travel experiences.
              </p>
            </div>
          </div>
          <div className="section">
            <div className="section-text">
              <h2>
                Our <br /> Services
              </h2>
              <p>
                We offer a diverse range of travel services including guided
                tours, customized travel packages, and expert travel advice to
                help you plan your perfect getaway.
              </p>
            </div>
          </div>
          <div className="section">
            <div className="section-text">
              <h2>
                Our <br /> Commitment
              </h2>
              <p>
                We are committed to providing high-quality services and ensuring
                that every aspect of your trip is carefully planned and executed
                for a seamless travel experience.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="tour-gallery">
        <h2>Tour Gallery</h2>
        <div className="gallery">
          {[img1, img2, img3, img4, img5, img6, img7, img8].map(
            (src, index) => (
              <img
                key={index}
                src={src}
                alt={`Gallery Image ${index + 1}`}
                className={enlargedImg === src ? "enlarged" : ""}
                onClick={() => handleImageClick(src)}
              />
            )
          )}
        </div>
      </div>
      {enlargedImg && (
        <div
          className="backdrop"
          onClick={handleBackgroundClick}
        ></div>
      )}
    </div>
  );
}
