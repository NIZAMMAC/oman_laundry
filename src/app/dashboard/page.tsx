import { getUserOrders } from '../actions';
import AccountDetails from '../../components/AccountDetails';
import db from '../../lib/db';
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const phone = cookieStore.get('userPhone')?.value || "+968 9123 4567";
  const orders = await getUserOrders(phone);
  
  // Fetch user data for the profile
  const user = await db.user.findUnique({ where: { phone } });
  
  const defaultName = user?.name || "Nizam (MVP User)";
  const defaultAddress = user?.address || "Al Qurum, Muscat\nOman";

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      
      <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
        <h1 className="h2">My Dashboard</h1>
        <a href="/book" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          New Booking
        </a>
      </div>

      <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
        
        {/* Active Orders */}
        <div className="glass-card" style={{ flex: '2', minWidth: '300px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Orders</h2>
          
          <div className="flex flex-col gap-4">
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You have no recent orders.</p>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{order.id}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pickup: {order.pickupDate}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      Delivery to: {order.address}
                    </div>
                    <div style={{ color: 'var(--text-main)', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 500 }}>
                      {order.services}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div style={{ fontWeight: 600 }}>{order.total > 0 ? `${order.total.toFixed(2)} OMR` : 'TBD'}</div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      background: order.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : order.status === 'In Progress' ? 'rgba(0, 112, 243, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: order.status === 'Pending' ? '#d97706' : order.status === 'In Progress' ? 'var(--primary)' : '#10b981'
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Account Info */}
        <AccountDetails initialPhone={phone} initialName={defaultName} initialAddress={defaultAddress} />

      </div>

    </div>
  );
}
