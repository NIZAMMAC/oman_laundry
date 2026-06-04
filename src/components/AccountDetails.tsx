"use client";

import { useState, useTransition } from 'react';
import { updateUserProfile } from '../app/actions';

export default function AccountDetails({ initialPhone, initialName, initialAddress }: { initialPhone: string, initialName: string, initialAddress: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(initialPhone);
  const [name, setName] = useState(initialName);
  const [address, setAddress] = useState(initialAddress);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateUserProfile(initialPhone, phone, name, address);
      if (result.success) {
        setIsEditing(false);
      } else {
        alert("Failed to update profile.");
      }
    });
  };

  return (
    <div className="glass-card" style={{ flex: '1', minWidth: '250px', height: 'fit-content' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Account Details</h2>
        {isEditing && (
          <button 
            onClick={() => setIsEditing(false)} 
            style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Cancel
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Phone</label>
            <input 
              type="text" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Saved Address</label>
            <textarea 
              value={address} 
              onChange={e => setAddress(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', resize: 'vertical' }}
            />
          </div>
          <button 
            className="btn-primary" 
            onClick={handleSave} 
            disabled={isPending || !name || !address || !phone}
            style={{ width: '100%', marginTop: '1rem', opacity: isPending ? 0.5 : 1 }}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Name</div>
          <div style={{ fontWeight: 500, marginBottom: '1.5rem' }}>{name}</div>

          <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Phone</div>
          <div style={{ fontWeight: 500, marginBottom: '1.5rem' }}>{phone}</div>
          
          <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Saved Address</div>
          <div style={{ fontWeight: 500, lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {address.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
          </div>
          
          <button 
            className="btn-secondary" 
            onClick={() => setIsEditing(true)}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
