import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Profile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await axios.get(`${apiUrl}/auth/${currentUser.uid}`);
                setUserData(res.data);
                setAddress(res.data.address || '');
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchUser();
        }
    }, [currentUser]);

    const handleSaveAddress = async () => {
        setSaving(true);
        setMsg('');
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.put(`${apiUrl}/auth/${currentUser.uid}`, { address });
            setMsg('Address saved successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.msg || err.message || 'Failed to save address.';
            setMsg(`Error: ${errorMsg}`);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    if (!currentUser) return <div className="container" style={{ paddingTop: '2rem' }}>Please log in.</div>;
    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>;

    return (
        <div className="container-fluid" style={{ paddingTop: '2rem', paddingBottom: '4rem', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>

            <div className="card glass" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--bg-surface)',
                        border: '2px solid var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'var(--primary)',
                        fontSize: '2.5rem'
                    }}>
                        {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{userData?.name || 'User'}</h2>
                        <p style={{ color: 'var(--text-light)' }}>{userData?.email || currentUser.email}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>Delivery Address</label>
                    <textarea
                        className="input-field"
                        rows="4"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your full delivery address..."
                        style={{ width: '100%', resize: 'vertical', minHeight: '100px' }}
                    />
                </div>

                {msg && <p style={{ color: msg.includes('Failed') ? 'red' : '#4CAF50', marginBottom: '1rem' }}>{msg}</p>}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleSaveAddress} className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Address'}
                    </button>
                    {userData?.role === 'admin' && (
                        <button onClick={() => navigate('/admin')} className="btn" style={{ background: '#FFC107', color: 'black' }}>
                            Admin Dashboard
                        </button>
                    )}
                    <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: '#E23744', color: '#E23744' }}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
