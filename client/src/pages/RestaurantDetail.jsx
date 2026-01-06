import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { FiEdit2 } from 'react-icons/fi';

const RestaurantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, cart } = useCart();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

                // Fetch Restaurant details
                const resRes = await axios.get(`${apiUrl}/restaurants/${id}`);
                setRestaurant(resRes.data);

                // Fetch Menu
                const resMenu = await axios.get(`${apiUrl}/restaurants/${id}/menu`);
                setMenu(resMenu.data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleEditRestaurant = () => {
        localStorage.setItem('editRestaurantId', id);
        navigate('/admin-dashboard');
    };

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>;
    if (!restaurant) return <div className="container" style={{ paddingTop: '2rem' }}>Restaurant not found</div>;

    const groupedMenu = menu.reduce((acc, item) => {
        const category = item.category || item.type || 'Recommended';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {});

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '400px',
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: '3rem',
                borderBottom: '1px solid var(--border-light)'
            }}>
                {/* Background Image with Blur */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${restaurant.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(20px) brightness(0.6)',
                    zIndex: -1
                }}></div>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, var(--bg-body), transparent 90%)',
                    zIndex: -1
                }}></div>

                <div className="container-fluid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2.5rem', alignItems: 'flex-end' }}>
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        style={{
                            width: '280px',
                            height: '280px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-lg)',
                            border: '4px solid rgba(255,255,255,0.1)'
                        }}
                    />
                    <div style={{ paddingBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {restaurant.name}
                        </h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                            {restaurant.cuisine.join(', ')} • {restaurant.address}
                        </p>

                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(10px)' }}>
                                <span style={{ color: '#4CAF50', fontSize: '1.2rem' }}>★</span>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{restaurant.rating}</span>
                                <span style={{ opacity: 0.7, fontSize: '0.9rem', marginLeft: '0.2rem' }}>Rating</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(10px)' }}>
                                <span>🕒</span>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{restaurant.deliveryTime}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(10px)' }}>
                                <span>💰</span>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>₹{restaurant.priceForTwo}</span>
                            </div>
                            {currentUser?.role === 'admin' && (
                                <button
                                    onClick={handleEditRestaurant}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'rgba(226, 55, 68, 0.2)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-full)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid var(--primary)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    <FiEdit2 size={18} /> Edit Restaurant
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="container-fluid" style={{ maxWidth: '1000px', margin: '3rem auto' }}>
                {Object.keys(groupedMenu).map(category => (
                    <div key={category} style={{ marginBottom: '4rem' }}>
                        <h3 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            marginBottom: '2rem',
                            paddingBottom: '0.5rem',
                            borderBottom: '2px solid var(--border-light)',
                            display: 'inline-block',
                            paddingRight: '2rem'
                        }}>
                            {category === 'undefined' ? 'Recommended' : category}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {groupedMenu[category].map(item => {
                                const inCartAmount = cart.find(c => c._id === item._id)?.quantity || 0;

                                return (
                                    <div key={item._id} className="glass" style={{
                                        padding: '1.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '2rem',
                                        transition: 'background 0.3s'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                width: '18px',
                                                height: '18px',
                                                border: `2px solid ${item.isVeg ? '#267E3E' : '#E23744'}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '0.8rem',
                                                borderRadius: '4px'
                                            }}>
                                                <div style={{ width: '8px', height: '8px', background: item.isVeg ? '#267E3E' : '#E23744', borderRadius: '50%' }}></div>
                                            </div>
                                            <h4 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.4rem' }}>{item.name}</h4>
                                            <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.8rem' }}>₹{item.price}</p>
                                            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '90%' }}>
                                                {item.description}
                                            </p>
                                        </div>

                                        <div style={{ position: 'relative', width: '160px', flexShrink: 0 }}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{
                                                    width: '160px',
                                                    height: '140px',
                                                    objectFit: 'cover',
                                                    borderRadius: 'var(--radius-md)',
                                                    boxShadow: 'var(--shadow-md)'
                                                }}
                                            />
                                            <button
                                                onClick={() => addToCart(item, restaurant._id, restaurant.name)}
                                                className="btn-primary"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '-15px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    padding: '0.5rem 2rem',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '800',
                                                    boxShadow: 'var(--shadow-md)',
                                                    border: 'none',
                                                    whiteSpace: 'nowrap',
                                                    minWidth: '100px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {inCartAmount > 0 ? `ADDED (${inCartAmount})` : 'ADD'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantDetail;
