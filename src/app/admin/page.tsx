import { getAllOrders } from '../actions';
import AdminOrdersTable from './AdminOrdersTable';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const orders = await getAllOrders();

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      
      <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 className="h2" style={{ marginBottom: '0.5rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all incoming laundry orders</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1rem', textAlign: 'center', minWidth: '120px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {orders.filter(o => o.status === 'Pending').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pending</div>
          </div>
          <div className="glass-card" style={{ padding: '1rem', textAlign: 'center', minWidth: '120px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {orders.filter(o => o.status === 'Delivered').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Delivered</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <AdminOrdersTable initialOrders={orders} />
      </div>

    </div>
  );
}
