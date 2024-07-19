import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingForm.css";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config.js";
import { processMockPayment, generateInvoice } from "../paymentService";

export default function BookingForm() {
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [timezone, setTimezone] = useState("Pacific Daylight Time (PDT)");
  const [availability, setAvailability] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isAvailabilityChecked, setIsAvailabilityChecked] = useState(false);
  const [pax, setPax] = useState(1);
  const [tourDuration, setTourDuration] = useState("2days");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const navigate = useNavigate();
  const { id } = useParams();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const docRef = doc(db, "tours", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTour(docSnap.data());
        } else {
          console.error("Tour not found");
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
      }
    };

    fetchTour();
  }, [id]);

  const handlePayment = () => {
    if (!tour) return;

    processMockPayment(tour.price, tour.title, paymentMethod)
      .then((response) => {
        if (response.success) {
          generateInvoice(tour);
          alert(`${response.message} and invoice generated!`);
        } else {
          alert("Payment failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Payment error:", error);
        alert("An error occurred during payment. Please try again.");
      });
  };

  if (!tour) return <div>Loading...</div>;

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    setIsAvailabilityChecked(false);
    setSelectedTime("");
  };

  const checkAvailability = () => {
    if (!selectedDates[0] || !selectedDates[1]) {
      setAvailability("Please select both start and end dates.");
      return;
    }
    setAvailability("Available");
    setIsAvailabilityChecked(true);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDates[0] && selectedDates[1] && selectedTime) {
      console.log("Start Date:", selectedDates[0]);
      console.log("End Date:", selectedDates[1]);
      console.log("Pickup Time:", selectedTime);

      try {
        // Push booking details to Firestore
        const bookingsRef = collection(db, "bookings");
        await addDoc(bookingsRef, {
          tourId: id,
          tourTitle: tour.title,
          pax,
          tourDuration,
          selectedDates,
          selectedTime,
          timezone,
          paymentMethod,
          status: "Pending", // Or any other status you want to use
          createdAt: new Date(),
        });

        // Process payment and generate invoice
        handlePayment();
      } catch (error) {
        console.error("Error saving booking:", error);
        alert("An error occurred while saving the booking. Please try again.");
      }
    } else {
      console.log("Please select start and end dates, and a pickup time.");
    }
  };

  const handlePaxChange = (e) => {
    setPax(parseInt(e.target.value));
  };

  const handleTourDurationChange = (e) => {
    setTourDuration(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <main className="booking-form-container">
      <button
        onClick={() => navigate(-1)}
        className="back-button"
        aria-label="Go back to the previous page"
      >
        &lt; Back
      </button>
      <header className="header-booking-container">
        <h1>{tour.title}</h1>
        <p>
          Check out our availability and book the date and time that works for
          you.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        aria-labelledby="booking-form"
        className="booking-form"
      >
        <section className="col-sm-4 pax-picker">
          <label htmlFor="pax">Number of People (Pax)</label>
          <input
            id="pax"
            type="number"
            value={pax}
            onChange={handlePaxChange}
            min="1"
            className=" custom-input"
            placeholder="Enter number of people"
          />
        </section>

        {pax < 13 && (
          <section className="col-sm-4  tour-duration-picker">
            <label htmlFor="tourDuration">Select Tour Duration</label>
            <select
              id="tourDuration"
              value={tourDuration}
              onChange={handleTourDurationChange}
              className="custom-select"
            >
              <option value="1day">1 Day Tour</option>
              <option value="2days">2 Days 1 Night</option>
              <option value="3days">3 Days 2 Nights</option>
              <option value="1week">1 Week Tour</option>
            </select>
          </section>
        )}

        <section className="date-picker">
          <label htmlFor="datePicker">Select Start and End Dates</label>
          <DatePicker
            id="datePicker"
            selected={selectedDates[0]}
            onChange={handleDateChange}
            startDate={selectedDates[0]}
            endDate={selectedDates[1]}
            selectsRange
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="custom-datepicker"
            placeholderText="Select a date range"
            maxDate={
              pax < 13
                ? new Date(
                    new Date().setDate(
                      new Date().getDate() +
                        (tourDuration === "1day"
                          ? 1
                          : tourDuration === "2days"
                            ? 2
                            : tourDuration === "3days"
                              ? 3
                              : 7)
                    )
                  )
                : null
            }
          />
        </section>

        <section className="timezone-picker">
          <label htmlFor="timezone">Timezone:</label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="custom-select"
          >
            <option value="Pacific Daylight Time (PDT)">
              Pacific Daylight Time (PDT)
            </option>
            {/* Add more timezones as needed */}
          </select>
        </section>

        <section className="availability">
          <p>{availability || "No availability check yet"}</p>
          <button
            type="button"
            className="check-availability-button"
            onClick={checkAvailability}
          >
            Check Availability
          </button>
        </section>

        {isAvailabilityChecked && (
          <section className="time-picker">
            <label htmlFor="pickupTime">Select Pickup Time</label>
            <select
              id="pickupTime"
              value={selectedTime}
              onChange={handleTimeChange}
              className="custom-timepicker"
            >
              <option
                value=""
                disabled
              >
                Select a pickup time
              </option>
              <option value="4:00 AM">4:00 AM</option>
              <option value="11:00 PM">11:00 PM</option>
              <option value="1:00 AM">1:00 AM</option>
            </select>
          </section>
        )}

        <section className="service-details">
          <h3>Service Details</h3>
          <p>{tour.name}</p>
          <p>{tour.price}</p>
        </section>

        <section className="payment-method">
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            className="custom-select"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Gcash">Gcash</option>
          </select>
        </section>

        <button
          type="submit"
          className="submit-button"
          disabled={!selectedDates[0] || !selectedDates[1] || !selectedTime}
        >
          Next
        </button>
      </form>
    </main>
  );
}
