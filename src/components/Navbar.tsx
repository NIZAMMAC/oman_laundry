"use client";

import { usePathname, useRouter } from 'next/navigation';
import { logoutUser } from '../app/actions';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const hideButtons = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <a href="/" className="logo">
          <span style={{ color: '#0088ff' }}>SIMS</span> <span style={{ color: '#ff3366' }}>AI</span> Laundry360
        </a>
        {!hideButtons ? (
          <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="/login" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
              Login
            </a>
            <a href="/book" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '1rem' }}>
              Book Now
            </a>
          </div>
        ) : (
          <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={handleLogout} 
              className="btn-secondary" 
              style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
