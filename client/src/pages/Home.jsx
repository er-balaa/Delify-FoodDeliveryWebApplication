import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import { motion } from 'framer-motion';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await axios.get(`${apiUrl}/restaurants`);
                setRestaurants(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <div className="main-content">
            {/* Hero Section */}
            <div
                style={{
                    height: '500px',
                    width: '100%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5)',
                    zIndex: -1
                }}></div>

                <div className="container-fluid animate-float">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: '4.5rem', marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                    >
                        Delify<span style={{ color: 'var(--primary)' }}>.</span>
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: '2rem', fontWeight: '400', opacity: 0.9, marginBottom: '3rem' }}
                    >
                        Discover the best food & drinks in Delhi NCR
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        style={{
                            background: 'white',
                            padding: '10px',
                            borderRadius: 'var(--radius-full)',
                            maxWidth: '600px',
                            margin: '0 auto',
                            display: 'flex',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search for restaurant, cuisine or a dish"
                            style={{
                                flex: 1,
                                border: 'none',
                                padding: '1rem 2rem',
                                fontSize: '1.1rem',
                                outline: 'none',
                                borderRadius: 'var(--radius-full)'
                            }}
                        />
                        <button className="btn btn-primary" style={{ padding: '0 2.5rem' }}>Search</button>
                    </motion.div>
                </div>
            </div>

            <div className="container-fluid" style={{ marginTop: '5rem', marginBottom: '5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Collections</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Explore curated lists of top restaurants, cafes, pubs, and bars in Delhi NCR</p>
                    </div>
                    <Link to="/restaurants" className="btn btn-ghost" style={{ color: 'var(--primary)' }}>See all collections ›</Link>
                </div>

                {loading ? (
                    <p>Loading amazing food...</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
                        {restaurants.map((restaurant, index) => (
                            <motion.div
                                key={restaurant._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <RestaurantCard restaurant={restaurant} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
