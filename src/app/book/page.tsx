"use client";

import { useState } from 'react';
import { createOrder } from '../actions';

export default function BookPickup() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toggleService = (service: string) => {
    setServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDateObj = new Date(today.getFullYear() + 1, 11, 31); // Dec 31 of next year
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');

  const isValidDate = () => {
    if (!date) return false;
    const selected = new Date(date);
    const min = new Date(minDate);
    const max = new Date(maxDate);
    return selected >= min && selected <= max;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const selected = new Date(date);
    const min = new Date(minDate);
    const max = new Date(maxDate);
    
    if (selected < min || selected > max) {
      alert("Please select a valid date between today and the end of next year.");
      setIsSubmitting(false);
      return;
    }
    
    const result = await createOrder({
      services,
      date,
      address
    });
    
    setIsSubmitting(false);

    if (result.success) {
      setStep(3); // Success step
    } else {
      alert("Failed to create order");
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      
      <div className="glass-card" style={{ padding: '3rem' }}>
        <h1 className="h2 text-center" style={{ marginBottom: '2rem' }}>Book a Pickup</h1>

        {/* Progress Bar */}
        <div className="flex justify-between items-center" style={{ marginBottom: '3rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '4px', background: 'var(--border)', zIndex: 0, transform: 'translateY(-50%)' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: 0, width: `${(step - 1) * 33.33}%`, height: '4px', background: 'var(--primary)', zIndex: 0, transform: 'translateY(-50%)', transition: 'var(--transition)' }}></div>
          
          {[1, 2, 3].map(num => (
            <div key={num} style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              background: step >= num ? 'var(--primary)' : 'var(--surface)',
              color: step >= num ? 'white' : 'var(--text-muted)',
              border: `2px solid ${step >= num ? 'var(--primary)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', zIndex: 1, transition: 'var(--transition)'
            }}>
              {num === 3 && step === 3 ? '✓' : num}
            </div>
          ))}
        </div>

        {/* Step 1: Services */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>1. Select Services</h2>
            <div className="flex flex-col gap-4">
              {['Wash & Fold', 'Dry Cleaning', 'Ironing Only'].map(service => (
                <div 
                  key={service} 
                  onClick={() => toggleService(service)}
                  style={{
                    padding: '1.5rem',
                    border: `2px solid ${services.includes(service) ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: services.includes(service) ? 'var(--primary-glow)' : 'transparent',
                    transition: 'var(--transition)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>{service}</span>
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', 
                    border: `2px solid ${services.includes(service) ? 'var(--primary)' : 'var(--border)'}`,
                    background: services.includes(service) ? 'var(--primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {services.includes(service) && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8" style={{ marginTop: '2rem' }}>
              <button 
                className="btn-primary" 
                onClick={() => setStep(2)}
                disabled={services.length === 0}
                style={{ opacity: services.length === 0 ? 0.5 : 1, cursor: services.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>2. Select Pickup Date</h2>
            <div className="flex flex-col gap-4">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Pickup Date</label>
              <input 
                type="date" 
                min={minDate}
                max={maxDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-main)',
                  fontSize: '1.125rem',
                  fontFamily: 'inherit',
                  width: '100%'
                }}
              />
              
              <label style={{ display: 'block', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 500 }}>Pickup Address (Optional)</label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Leave blank to use your saved profile address..."
                rows={3}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-main)',
                  fontSize: '1.125rem',
                  fontFamily: 'inherit',
                  width: '100%',
                  resize: 'vertical'
                }}
              />
            </div>
            <div className="flex justify-between mt-8" style={{ marginTop: '2rem' }}>
              <button className="btn-secondary" onClick={() => setStep(1)} disabled={isSubmitting}>Back</button>
              <button 
                className="btn-primary" 
                onClick={handleSubmit}
                disabled={!isValidDate() || isSubmitting}
                style={{ opacity: (!isValidDate() || isSubmitting) ? 0.5 : 1, cursor: (!isValidDate() || isSubmitting) ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="animate-fade-in text-center py-8" style={{ padding: '2rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 className="h2 text-primary" style={{ color: 'var(--primary)' }}>Booking Confirmed!</h2>
            <p className="p-large" style={{ marginBottom: '2rem' }}>
              Your pickup is scheduled for {date}. Our driver will collect it from your saved address.
            </p>
            <a href="/dashboard" className="btn-primary">
              View My Orders
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
