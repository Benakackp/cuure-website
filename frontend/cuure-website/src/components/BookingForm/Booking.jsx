import { useState, useRef, useEffect } from 'react'
import styles from './Booking.module.css'

const specialties = ['Doctor Consultation', 'Nurseing Care', 'Physiotherapy', 'Lab tests at Home', 'Elderly care', '24/7 Emergency Visit']
const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

function CustomSelect({ name, value, onChange, options, placeholder, required }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    onChange({ target: { name, value: option } })
    setOpen(false)
  }

  return (
    <div className={styles.customSelect} ref={ref}>
      <div
        className={`${styles.customSelectTrigger} ${open ? styles.open : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span className={value ? '' : styles.placeholder}>
          {value || placeholder}
        </span>
        <span className={styles.arrow}>▾</span>
      </div>
      {open && (
        <ul className={styles.customSelectOptions}>
          {options.map(opt => (
            <li
              key={opt}
              className={`${styles.customSelectOption} ${value === opt ? styles.selected : ''}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
      {/* Hidden input for form validation */}
      <input type="text" name={name} value={value} required={required} readOnly style={{ display: 'none' }} />
    </div>
  )
}

export default function Booking() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob:'', Age:'', specialty: '', date: '', time: '', type: 'in-person', notes: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✅</div>
        <h2>Appointment Booked!</h2>
        <p>We've sent a confirmation to <strong>{form.email}</strong>. Our team will reach out to confirm your slot shortly.</p>
        <button className={styles.btnReset} onClick={() => setSubmitted(false)}>Book Another</button>
      </div>
    )
  }

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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2>Book Your Consultation</h2>
        <p>Fill in your details and we'll confirm your appointment within 15 minutes.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Full Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
        </div>
        <div className={styles.field}>
          <label>Email </label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
        </div>
        <div className={styles.field}>
          <label>Phone Number *</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
        </div>
        <div className={styles.field}>
        <label>Date of Birth *</label>
        <input 
        name="dob" 
        type="date" 
        value={form.dob} 
        onChange={handleChange} 
        required 
        max={new Date().toISOString().split('T')[0]}
      />
        {form.dob && (
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        Age: {calculateAge(form.dob)}
        </span>
      )}
      </div>
        <div className={styles.field}>
          <label>Specialty *</label>
          <CustomSelect
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            options={specialties}
            placeholder="Select a specialty"
            required
          />
        </div>
        <div className={styles.field}>
          <label>Preferred Date *</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
        </div>
        <div className={styles.field}>
          <label>Preferred Time *</label>
          <CustomSelect
            name="time"
            value={form.time}
            onChange={handleChange}
            options={timeSlots}
            placeholder="Select a time"
            required
          />
        </div>
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label>Notes / Symptoms (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Describe your symptoms or any relevant medical history..." rows={4} />
      </div>

      <button type="submit" className={styles.btnSubmit}>
        Confirm Appointment →
      </button>
    </form>
  )
}
