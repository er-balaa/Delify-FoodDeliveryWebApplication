import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { auth } from '../firebase';

const Navbar = () => {
    const { currentUser, dbUser } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === '/login') {
        return null;
    }


    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="header glass fixed top-0 w-full z-50" style={{ height: 'var(--header-height)', display: 'flex', alignItems: 'center' }}>
            <div className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1600px', margin: '0 auto' }}>
                <Link to="/" style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-1px', paddingLeft: '1rem', textDecoration: 'none', color: 'var(--text-main)' }}>
                    Delify<span className="text-gradient">.</span>
                </Link>

                <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', paddingRight: '1rem' }}>
                    <Link to="/restaurants" className="btn-ghost" style={{ fontSize: '1.05rem', fontWeight: '500' }}>Restaurants</Link>

                    {currentUser ? (
                        <>
                            <Link to="/orders" className="btn-ghost" style={{ fontSize: '1.05rem', fontWeight: '500' }}>My Orders</Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {(dbUser?.role === 'admin' || currentUser.email === 'delifyadmin@gmail.com') && (
                                    <Link to="/admin" style={{ textDecoration: 'none' }}>
                                        <span style={{
                                            background: '#FFC107',
                                            color: 'black',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            letterSpacing: '0.5px',
                                            display: 'inline-block',
                                            cursor: 'pointer'
                                        }}>
                                            ADMIN DASHBOARD
                                        </span>
                                    </Link>
                                )}

                                {dbUser?.role === 'restaurant_owner' && (
                                    <Link to="/vendor-dashboard" style={{ textDecoration: 'none' }}>
                                        <span style={{
                                            background: '#4CAF50',
                                            color: 'white',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            letterSpacing: '0.5px',
                                            display: 'inline-block',
                                            cursor: 'pointer'
                                        }}>
                                            OWNER DASHBOARD
                                        </span>
                                    </Link>
                                )}
                                <Link to="/profile" style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--bg-surface)',
                                        border: currentUser.email === 'delifyadmin@gmail.com' ? '2px solid #FFC107' : '1px solid var(--border-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        color: currentUser.email === 'delifyadmin@gmail.com' ? '#FFC107' : 'var(--primary)',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer'
                                    }}>
                                        {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                                    </div>
                                </Link>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.6em 1.2em', fontSize: '0.9rem' }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost" style={{ fontSize: '1rem' }}>Log in</Link>
                            <Link to="/login" className="btn btn-primary" style={{ padding: '0.7em 1.5em' }}>Sign Up</Link>
                        </>
                    )}

                    <Link to="/cart" className="btn btn-primary" style={{ padding: '0.7em 1.5em', display: 'flex', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>🛒</span>
                        {cartCount > 0 && <span style={{ background: 'white', color: 'var(--primary)', borderRadius: '20px', padding: '1px 8px', fontSize: '0.85rem', fontWeight: '800' }}>{cartCount}</span>}
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
