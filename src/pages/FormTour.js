import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../firebase/config";
import "./create.css";

export default function Create() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [inclusion, setInclusion] = useState("");
  const [exclusion, setExclusion] = useState("");
  const [highlights, setHighlights] = useState("");
  const [image, setImage] = useState(null); // New state for image file
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch the current last ID and increment it
      const idDocRef = doc(db, "config", "lastTourId");
      const idDocSnap = await getDoc(idDocRef);
      let newId;

      if (idDocSnap.exists()) {
        newId = idDocSnap.data().lastId + 1;
        await setDoc(idDocRef, { lastId: newId });
      } else {
        newId = 1;
        await setDoc(idDocRef, { lastId: newId });
      }

      // Upload image to Firebase Storage
      let imageUrl = "";
      if (image) {
        const imageRef = storageRef(storage, `tours/${newId}/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const tour = {
        id: newId,
        title,
        price,
        description,
        duration,
        location,
        date,
        time,
        inclusion,
        exclusion,
        highlights,
        imageUrl, // Include image URL
      };

      const ref = collection(db, "tours");
      await addDoc(ref, tour);
      navigate("/");
    } catch (error) {
      console.error("Error adding tour:", error);
    }
  };

  return (
    <div className="create">
      <h2 className="page-title">Add a New Tour</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Title:</span>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </label>

        <label>
          <span>Price:</span>
          <input
            type="text"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            required
          />
        </label>

        <label>
          <span>Duration:</span>
          <input
            type="text"
            onChange={(e) => setDuration(e.target.value)}
            value={duration}
            required
          />
        </label>

        <label>
          <span>Location:</span>
          <input
            type="text"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            required
          />
        </label>

        <label>
          <span>Date:</span>
          <input
            type="text"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            required
          />
        </label>

        <label>
          <span>Pickup Time:</span>
          <input
            type="text"
            onChange={(e) => setTime(e.target.value)}
            value={time}
            required
          />
        </label>

        <label>
          <span>Inclusions:</span>
          <input
            type="text"
            onChange={(e) => setInclusion(e.target.value)}
            value={inclusion}
            required
          />
        </label>

        <label>
          <span>Exclusions:</span>
          <input
            type="text"
            onChange={(e) => setExclusion(e.target.value)}
            value={exclusion}
            required
          />
        </label>

        <label>
          <span>Highlights:</span>
          <input
            type="text"
            onChange={(e) => setHighlights(e.target.value)}
            value={highlights}
            required
          />
        </label>

        <label>
          <span>Description:</span>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
        </label>

        <label>
          <span>Image:</span>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </label>

        <button className="btn">Submit</button>
      </form>
    </div>
  );
}
