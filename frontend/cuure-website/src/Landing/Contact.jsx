import { useState } from "react";
import axios from "axios";

export default function Contact() {

  const [form, setForm] = useState({
    patient_name: "",
    dob: "",
    age: "",
    phone: "",
    date: "",
    time_value: "",
    doctor_name: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);

  const doctors = [
    "Dr. Sharma",
    "Dr. Kumar",
    "Dr. Priya",
    "Dr. Ramesh"
  ];

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM"
  ];

  // Calculate Age
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years}Y ${months}M`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const age = calculateAge(value);
      setForm({ ...form, dob: value, age });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending data:", {
  patient_name: form.patient_name,
  age: form.age,
  phone: form.phone,
  date: form.date,
  time_value: form.time_value,
  doctor_name: form.doctor_name,
  address: form.address
});
      await axios.post("http://localhost:3000/api/book-appointment", {
        patient_name: form.patient_name,
        age: form.age,
        phone: form.phone,
        date: form.date,
        time_value: form.time_value,
        doctor_name: form.doctor_name,
        address: form.address
      });

      alert("Appointment booked successfully!");

      setForm({
        patient_name: "",
        dob: "",
        age: "",
        phone: "",
        date: "",
        time_value: "",
        doctor_name: "",
        address: ""
      });

    } catch (err) {
      alert("Failed to submit form");
      console.error(err);
    }

    setLoading(false);
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  };

  return (
    <section id="contact">
      <h2>Book Appointment</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "400px"
        }}
      >

        <div style={fieldStyle}>
          <label>Patient Name</label>
          <input
            style={inputStyle}
            name="patient_name"
            value={form.patient_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={fieldStyle}>
          <label>Date of Birth</label>
          <input
            style={inputStyle}
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div style={fieldStyle}>
          <label>Age</label>
          <input
            style={inputStyle}
            name="age"
            value={form.age}
            readOnly
          />
        </div>

        <div style={fieldStyle}>
          <label>Phone Number</label>
          <input
            style={inputStyle}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div style={fieldStyle}>
          <label>Appointment Date</label>
          <input
            style={inputStyle}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div style={fieldStyle}>
          <label>Select Doctor</label>
          <select
            style={inputStyle}
            name="doctor_name"
            value={form.doctor_name}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc, index) => (
              <option key={index} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Select Time Slot</label>
          <select
            style={inputStyle}
            name="time_value"
            value={form.time_value}
            onChange={handleChange}
            required
          >
            <option value="">Select Time</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Address</label>
          <textarea
            style={inputStyle}
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            background: "#007BFF",
            color: "white",
            cursor: "pointer"
          }}
        >
          {loading ? "Booking..." : "Submit"}
        </button>

      </form>
    </section>
  );
}