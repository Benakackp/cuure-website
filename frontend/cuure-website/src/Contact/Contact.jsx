import { useState } from "react";
import axios from "axios";
import "./Contact.css";

export default function Contact() {
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
    "03:30 PM",
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

  const fetchBookedSlots = async (doctor, date) => {
    if (!doctor || !date) return;
    try {
      const res = await axios.get("http://localhost:3000/api/booked-slots", {
        params: { doctor_name: doctor, date },
      });
      if (res.data.success) setBookedSlots(res.data.data);
    } catch (err) {
      console.error("Failed to fetch slots");
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/book-appointment", {
        patient_name: form.patient_name,
        age: form.age,
        phone: form.phone,
        date: form.date,
        time_value: form.time_value,
        doctor_name: form.doctor_name,
        address: form.address,
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
        address: "",
      });
    } catch (err) {
      alert("Failed to submit form");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <section id="contact">

      {/* Nav */}
      <nav className="appt-nav">
        <span className="appt-nav-badge">Book a Visit</span>
      </nav>

      {/* Hero */}
      <div className="appt-hero">
        <h1>
          Book Your <span>Appointment</span>
        </h1>
        <p>Schedule a in-person consultation with our expert doctors.</p>
      </div>

      {/* Body */}
      <div className="appt-body">

        {/* Form Card */}
        <div className="appt-form-card">
          <h2>Book Your Consultation</h2>
          <p className="appt-subtitle">
            Fill in your details and we'll confirm your appointment within 15 minutes.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="appt-grid">

              {/* Patient Name */}
              <div className="appt-field">
                <label>Full Name <span className="req">*</span></label>
                <input
                  name="patient_name"
                  value={form.patient_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              

              {/* Phone */}
              <div className="appt-field">
                <label>Phone Number <span className="req">*</span></label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="appt-field">
                <label>Date of Birth <span className="req">*</span></label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Hidden Age (auto-calculated, sent to backend) */}
              <input type="hidden" name="age" value={form.age} readOnly />

              {/* Doctor / Specialty */}
              <div className="appt-field">
                <label>Doctors<span className="req">*</span></label>
                <div className="appt-select-wrap">
                  <select
                    name="doctor_name"
                    value={form.doctor_name}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select your Doctor</option>
                    {doctors.map((doc, i) => (
                      <option key={i} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Date */}
              <div className="appt-field">
                <label>Preferred Date <span className="req">*</span></label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Time Slot */}
              <div className="appt-field full">
                <label>Preferred Time <span className="req">*</span></label>
                <div className="appt-select-wrap">
                  <select
                    name="time_value"
                    value={form.time_value}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a time</option>
                    {timeSlots
                      .filter((slot) => !bookedSlots.includes(slot))
                      .map((slot, i) => (
                        <option key={i} value={slot}>{slot}</option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Address / Notes */}
              <div className="appt-field full">
                <label>Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Describe your symptoms or any relevant medical history..."
                />
              </div>

            </div>

            <button type="submit" className="appt-submit" disabled={loading}>
              {loading ? (
                <><span className="appt-spinner" /> Booking...</>
              ) : (
                <>Confirm Appointment →</>
              )}
            </button>
          </form>
        </div>

        {/* Side Info Cards */}
        <div className="appt-side">
          <div className="appt-info-card">
            <div className="ic-icon">⏱️</div>
            <h3>Quick Confirmation</h3>
            <p>Get your appointment confirmed within 15 minutes of booking.</p>
          </div>

          <div className="appt-info-card">
            <div className="ic-icon">🔒</div>
            <h3>Private & Secure</h3>
            <p>Your health data is encrypted and never shared without consent.</p>
          </div>

          <div className="appt-info-card">
            <div className="ic-icon">💬</div>
            <h3>WhatsApp Support</h3>
            <p>Get instant updates and chat with our team directly on WhatsApp.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
