import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
    const { cart, cartTotal, updateQuantity, removeFromCart, clearCart, restaurantId } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (currentUser) {
            const fetchAddress = async () => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const res = await axios.get(`${apiUrl}/auth/${currentUser.uid}`);
                    if (res.data?.address) setAddress(res.data.address);
                } catch (err) {
                    console.error("Address fetch error", err);
                }
            };
            fetchAddress();
        }
    }, [currentUser]);

    const handleCheckout = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (!address.trim()) {
            alert("Please provide a delivery address.");
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

            // Validate before sending
            if (!restaurantId) {
                alert("Error: Restaurant ID missing. Please clear cart and try again.");
                return;
            }

            await axios.post(`${apiUrl}/orders`, {
                user: currentUser.uid,
                restaurant: restaurantId,
                items: cart.map(item => ({ menuItem: item._id, quantity: item.quantity, price: item.price })),
                totalAmount: cartTotal,
                deliveryAddress: address
            });

            alert("Order Successful");
            clearCart();
            navigate('/orders');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.msg || error.message || "Failed to place order.";
            alert(`Failed: ${msg}`);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <img src="https://b.zmtcdn.com/web_assets/b151b8ee7afcd7b6d19477033575635f1604922119.png" alt="Empty Cart" style={{ width: '200px' }} />
                <h2 style={{ margin: '1rem 0' }}>Your cart is empty</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You can go to home page to view more restaurants</p>
                <Link to="/" className="btn btn-primary">See Restaurants near you</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '300px' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Secure Checkout</h2>
                <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    {cart.map(item => (
                        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '15px', height: '15px', border: '1px solid green', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', background: 'green', borderRadius: '50%' }}></div>
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{item.name}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>₹{item.price}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--primary-color)', borderRadius: '4px', padding: '2px 5px' }}>
                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>+</button>
                            </div>
                            <p style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</p>
                        </div>
                    ))}

                    <textarea
                        placeholder="Any suggestions? We will pass it on..."
                        style={{ width: '100%', marginTop: '1rem', fontSize: '0.9rem', padding: '0.5rem', minHeight: '60px' }}
                    ></textarea>
                </div>
            </div>

            <div style={{ flex: 1, minWidth: '300px' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '0.8rem' }}>Delivery Address</h3>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your complete delivery address..."
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'transparent',
                                minHeight: '80px',
                                resize: 'vertical',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    <h3 style={{ marginBottom: '1rem' }}>Bill Details</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <span>Item Total</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <span>Delivery Fee</span>
                        <span>₹40</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <span>Govt Taxes & Restaurant Charges</span>
                        <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                    </div>
                    <div style={{ height: '1px', background: 'var(--border-color)', margin: '1rem 0' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.1rem' }}>
                        <span>To Pay</span>
                        <span>₹{(cartTotal + 40 + cartTotal * 0.05).toFixed(2)}</span>
                    </div>

                    <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
