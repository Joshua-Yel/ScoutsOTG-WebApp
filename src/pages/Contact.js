import { useLocation } from "react-router-dom";
import headerImg from "../assets/header4.png";
import { BsMap, BsPhone, BsEnvelope } from "react-icons/bs";

export default function Contact() {
  const queryString = useLocation().search;
  console.log(queryString);

  const queryParams = new URLSearchParams(queryString);
  const name = queryParams.get("name");
  const age = queryParams.get("age");

  return (
    <div className="container contact-container">
      <div className="header-image-container">
        <img
          src={headerImg}
          alt="Header"
          className="img-fluid mb-3 header-image"
        />
      </div>
      <div className="row">
        <div className="col-sm-4">
          <div className="contact-details">
            <h2>Contact Us</h2>
            <p>
              <BsMap /> Address: Marikina City, Philippines
            </p>
            <p>
              <BsPhone /> Phone: 09275687245
            </p>
            <p>
              <BsEnvelope /> Email: TravelScouts.otg@gmail.com
            </p>
          </div>
        </div>
        <div className="col">
          <div className="contact-form">
            <h2>Hello! Send Us a Message</h2>
            <form>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Your Name"
                  name="Name"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="email"
                  placeholder="Your Email"
                  name="email"
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="Your Message"
                  name="your message"
                  rows="5"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
