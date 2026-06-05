"use client";

import { useTransition, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { updateOrderStatus, Order } from '../actions';

type AdminOrder = Order & { customerName: string; customerPhone: string };

export default function AdminOrdersTable({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [isPending, startTransition] = useTransition();
  const [promptOrderId, setPromptOrderId] = useState<string | null>(null);
  const [promptPrice, setPromptPrice] = useState('');
  const [confirmDeliveryId, setConfirmDeliveryId] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSetPrice = () => {
    if (!promptOrderId) return;
    const parsedPrice = parseFloat(promptPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert("Invalid price. Please enter a valid number greater than 0.");
      return;
    }

    startTransition(async () => {
      await updateOrderStatus(promptOrderId, 'In Progress', parsedPrice);
      setPromptOrderId(null);
      setPromptPrice('');
    });
  };

  const handleConfirmDelivery = () => {
    if (!confirmDeliveryId) return;
    
    startTransition(async () => {
      // Find current total to pass it along so it isn't lost
      const order = initialOrders.find(o => o.id === confirmDeliveryId);
      await updateOrderStatus(confirmDeliveryId, 'Delivered', order?.total);
      setConfirmDeliveryId(null);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706' };
      case 'In Progress': return { bg: 'rgba(0, 112, 243, 0.1)', text: 'var(--primary)' };
      case 'Delivered': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
      default: return { bg: 'var(--surface)', text: 'var(--text-main)' };
    }
  };

  const filteredOrders = initialOrders
    .filter(order => filterStatus === 'All' || order.status === filterStatus)
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortBy === 'oldest' ? timeA - timeB : timeB - timeA;
    });

  return (
    <div style={{ opacity: isPending ? 0.7 : 1, transition: 'opacity 0.2s' }}>
      <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexWrap: 'wrap' }}>
        <select 
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', fontFamily: 'inherit', fontWeight: 500, minWidth: '150px' }}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Delivered">Delivered</option>
        </select>
        
        <select 
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', fontFamily: 'inherit', fontWeight: 500, minWidth: '150px' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
          <tr>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Order ID</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Customer</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Services</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date & Address</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found matching the filters.</td>
            </tr>
          )}
          {filteredOrders.map((order, index) => {
            const statusStyle = getStatusColor(order.status);
            return (
              <tr key={order.id} style={{ borderBottom: index === filteredOrders.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '1.5rem', fontWeight: 600 }}>{order.id}</td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{order.customerPhone}</div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.875rem' }}>{order.services}</div>
                  <div style={{ fontWeight: 500, marginTop: '0.25rem' }}>
                    {order.total > 0 ? `${order.total.toFixed(2)} OMR` : 'TBD'}
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.875rem' }}>{order.pickupDate}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{order.address}</div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    background: statusStyle.bg,
                    color: statusStyle.text,
                    whiteSpace: 'nowrap'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {order.status === 'Pending' && (
                      <button 
                        className="btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', opacity: isPending ? 0.5 : 1 }}
                        disabled={isPending}
                        onClick={() => setPromptOrderId(order.id)}
                      >
                        Accept & Set Price
                      </button>
                    )}
                    {order.status === 'In Progress' && (
                      <button 
                        className="btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: '#10b981', boxShadow: 'none', opacity: isPending ? 0.5 : 1 }}
                        disabled={isPending}
                        onClick={() => setConfirmDeliveryId(order.id)}
                      >
                        Deliver
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {/* Set Price Modal */}
      {mounted && promptOrderId && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Set Order Price</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Enter the total price in OMR for order {promptOrderId}.</p>
            <input 
              type="number" 
              value={promptPrice}
              onChange={e => setPromptPrice(e.target.value)}
              placeholder="e.g. 15.50"
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', marginBottom: '1.5rem', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setPromptOrderId(null)} disabled={isPending}>Cancel</button>
              <button className="btn-primary" onClick={handleSetPrice} disabled={isPending || !promptPrice}>Confirm & Accept</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Confirm Delivery Modal */}
      {mounted && confirmDeliveryId && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Confirm Delivery</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Are you sure you want to mark order {confirmDeliveryId} as Delivered? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setConfirmDeliveryId(null)} disabled={isPending}>Cancel</button>
              <button className="btn-primary" onClick={handleConfirmDelivery} disabled={isPending} style={{ background: '#10b981', boxShadow: 'none' }}>Yes, Deliver</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
