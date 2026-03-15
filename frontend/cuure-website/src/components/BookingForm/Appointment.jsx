// Appointment.jsx
import BookingForm from "./Booking";
import styles from "./Appointment.module.css";

export default function Appointment() {
  return (
    <>
    <div className={styles.hero}>
    <span className={styles.badge}>Book a Visit</span>
    <h1>Book Your <span>Appointment</span></h1>
    <p>Schedule a in-person consultation with our expert doctors.</p>
  </div>
    <div className={styles.page}>
      {/* Background image with overlay */}
      <div className={styles.bg} />

      <div className={styles.container}>
        {/* Left: Booking Form */}
        <div className={styles.formWrap}>
          <BookingForm />
        </div>

        {/* Right: Info Cards */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <span className={styles.icon}>⏱️</span>
            <h4>Quick Confirmation</h4>
            <p>Get your appointment confirmed within 15 minutes of booking.</p>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>🔒</span>
            <h4>Private & Secure</h4>
            <p>Your health data is encrypted and never shared without consent.</p>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>💬</span>
            <h4>WhatsApp Support</h4>
            <p>Get instant updates and chat with our team directly on WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}