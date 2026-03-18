import { useState } from "react";
import axios from "axios";
import "./booking.css";

export default function Booking() {
  const [form, setForm] = useState({
    patient_name: "",
    dob: "",
    age: "",
    phone: "",
    date: "",
    time_value: "",
    doctor_name: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const doctors = ["Dr. Sharma", "Dr. Kumar", "Dr. Priya", "Dr. Ramesh"];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  ];

  // Calculate age
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

  // Fetch API
  const fetchBookedSlots = async (doctor, date) => {
    if (!doctor || !date) return;

    try {
      const res = await axios.get(
        "http://localhost:3000/api/booked-slots",
        {
          params: { doctor_name: doctor, date },
        }
      );

      if (res.data.success) {
        setBookedSlots(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch slots");
    }
  };

  // DOB
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const age = calculateAge(value);
      setForm({ ...form, dob: value, age });
    } else {
      const newForm = { ...form, [name]: value };
      setForm(newForm);

      if (name === "doctor_name" || name === "date") {
        fetchBookedSlots(
          name === "doctor_name" ? value : newForm.doctor_name,
          name === "date" ? value : newForm.date
        );
      }
    }
  };

  // Phone
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/book-appointment",
        {
          patient_name: form.patient_name,
          age: form.age,
          phone: form.phone,
          date: form.date,
          time_value: form.time_value,
          doctor_name: form.doctor_name,
          address: form.address,
        }
      );

      alert("Appointment booked successfully!");

      setForm({
        patient_name: "",
        dob: "",
        age: "",
        phone: "",
        date: "",
        time_value: "",
        doctor_name: "",
        address: "",
      });

    } catch (err) {
      alert("Failed to submit form");
      console.error(err);
    }

    setLoading(false);
  };

  // Time slot 
  const getAvailableTimeSlots = () => {
  const now = new Date();

    return timeSlots.filter(slot => {

      // If selected date is not today → allow all
      if (form.date !== now.toISOString().split("T")[0]) {
        return true;
      }

      // Convert slot time to Date
      const [time, modifier] = slot.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0);

      return slotTime > now;
    });
  };

  return (
    <section id="booking">


      {/* HERO */}
      <div className="appt-hero">
        <h1>Book Your <span>Appointment</span></h1>
        <p>Schedule a in-person consultation with our expert doctors at your Home.</p>
      </div>

      {/* BODY */}
      <div className="appt-body">
        <div className="appt-container">
          {/* form + side */}

        {/* FORM */}
        <div className="appt-form-card">
          <h2>Book Your Consultation</h2>
          <p className="appt-subtitle">
            Fill in your details and we'll confirm your appointment within 15 minutes.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="appt-grid">

              <div className="appt-field">
                <label>Full Name *</label>
                <input
                  name="patient_name"
                  value={form.patient_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="appt-field">
                <label>Phone *</label>
                {/* <input
                  name="phone"
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // only numbers
                    if (value.length <= 10) {
                      setForm({ ...form, phone: value });
                    }
                  }}
                  placeholder="Phone (10 digits)"
                  required
                /> */}

                {/* For extra Sounds */}
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onInput={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 10) {
                      // 🔊 play sound
                      const audio = new Audio("/Sounds/phone.mp3");
                      audio.play();
                      // cut back to 10 digits
                      value = value.slice(0, 10);
                    }
                    e.target.value = value;
                  }}
                  placeholder="Phone (10 digits)"
                  required
                />
              </div>

              {/* <div className="appt-field">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                />
              </div> */}

              {/* Hidden age (important for backend) */}
              <input type="hidden" value={form.age} />

              <div className="appt-field">
                <label>Doctor *</label>
                <select
                  name="doctor_name"
                  value={form.doctor_name}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc, i) => (
                    <option key={i} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              <div className="appt-field">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="appt-field full">
                <label>Time *</label>
                <select
                  name="time_value"
                  value={form.time_value}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Time</option>
                  {getAvailableTimeSlots()
                    .filter(slot => !bookedSlots.includes(slot))
                    .map((slot, i) => (
                      <option key={i} value={slot}>{slot}</option>
                    ))}
                </select>
              </div>

              <div className="appt-field full">
                <label>Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button type="submit" className="appt-submit" disabled={loading}>
              {loading ? "Booking..." : "Confirm Appointment →"}
            </button>
          </form>
        </div>

        {/* SIDE CARDS */}
        <div className="appt-side">
          <div className="appt-info-card">
            <h3>Quick Confirmation</h3>
            <p>Get confirmation within 15 minutes.</p>
          </div>

          <div className="appt-info-card">
            <h3>Secure</h3>
            <p>Your data is safe and encrypted.</p>
          </div>

          <div className="appt-info-card">
            <h3>Support</h3>
            <p>Get instant updates on WhatsApp.</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}