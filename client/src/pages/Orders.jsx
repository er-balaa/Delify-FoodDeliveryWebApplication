import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const DeliveryInfo = ({ order }) => {
    if (order.status === 'delivered') {
        return (
            <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: '700', color: '#4CAF50' }}>
                Enjoy your meal!
            </span>
        );
    }

    if (order.estimatedDeliveryTime) {
        return (
            <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>
                Arriving in: {order.estimatedDeliveryTime}
            </span>
        );
    }

    return (
        <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-light)', fontStyle: 'italic' }}>
            Waiting for restaurant update...
        </span>
    );
};

const Orders = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await axios.get(`${apiUrl}/orders/user/${currentUser.uid}`);
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        let socket;

        if (currentUser) {
            fetchOrders();

            // Real-time connection
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            // Extract base URL if it has /api suffix
            const socketUrl = apiUrl.replace('/api', '');

            socket = io(socketUrl);
            socket.emit('join_user_room', currentUser.uid);

            socket.on('order_updated', (updatedOrder) => {
                console.log("Order updated:", updatedOrder);
                setOrders(prevOrders =>
                    prevOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o)
                );
            });
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, [currentUser]);

    if (!currentUser) return <div className="container">Please log in to view orders.</div>;

    return (
        <div className="container-fluid" style={{ paddingTop: '2rem', paddingBottom: '4rem', minHeight: '100vh', maxWidth: '1600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>
                My Orders <span style={{ fontSize: '1.2rem', color: 'var(--text-light)', fontWeight: '400' }}>({orders.length})</span>
            </h1>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        border: "3px solid rgba(226, 55, 68, 0.3)",
                        borderRadius: "50%",
                        borderTopColor: "var(--primary)",
                        animation: "spin 1s ease-in-out infinite"
                    }}></div>
                </div>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
                    <h2 style={{ marginBottom: '1rem' }}>No orders yet</h2>
                    <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Looks like you haven't indulged in some delicious food yet.</p>
                    <Link to="/" className="btn btn-primary">Start Ordering</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order._id} className="card glass card-hover" style={{
                            padding: '0',
                            overflow: 'hidden',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <div style={{
                                padding: '1.5rem',
                                display: 'flex',
                                gap: '1.5rem',
                                alignItems: 'flex-start',
                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <img
                                    src={order.restaurant?.image || 'https://placehold.co/100x100?text=Rest'}
                                    alt={order.restaurant?.name}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: 'var(--radius-sm)'
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{order.restaurant?.name || 'Unknown Restaurant'}</h3>
                                        <div style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <DeliveryInfo order={order} />
                                            <div style={{
                                                padding: '4px 10px',
                                                borderRadius: '4px',
                                                background: order.status === 'delivered' ? 'rgba(76, 175, 80, 0.2)' :
                                                    order.status === 'placed' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(33, 150, 243, 0.2)',
                                                color: order.status === 'delivered' ? '#4CAF50' :
                                                    order.status === 'placed' ? '#FFC107' : '#2196F3'
                                            }}>
                                                {order.status === 'placed' ? 'PLACED' :
                                                    order.status === 'out_for_delivery' ? 'OUT FOR DELIVERY' :
                                                        order.status.replace('_', ' ').toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹{order.totalAmount}</span>
                                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>• {order.items.length} Items</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-light)' }}>Order Details</h4>
                                <div style={{ display: 'grid', gap: '0.8rem' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-main)'
                                                }}>{item.quantity}x</span>
                                                <span style={{ color: 'var(--text-light)' }}>
                                                    {item.menuItem?.name || 'Item Unavailable'}
                                                </span>
                                            </div>
                                            <span style={{ color: 'var(--text-main)' }}>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}>
                                        Reorder
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
