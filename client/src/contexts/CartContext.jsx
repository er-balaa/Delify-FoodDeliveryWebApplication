import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [restaurantId, setRestaurantId] = useState(null);
    const [restaurantName, setRestaurantName] = useState(null);
    const [isCartLoaded, setIsCartLoaded] = useState(false); // New state to track if we've synced with DB

    // Load cart from backend when user logs in
    useEffect(() => {
        const fetchCart = async () => {
            if (loading) return;

            if (currentUser) {
                // If we already have items (e.g. from guest session), we mark as loaded so we can sync them UP
                if (cart.length > 0) {
                    setIsCartLoaded(true);
                    return;
                }

                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    console.log("Fetching cart for user:", currentUser.uid);
                    const res = await axios.get(`${apiUrl}/cart/${currentUser.uid}`);

                    if (res.data && res.data.items && res.data.items.length > 0) {
                        console.log("Cart found:", res.data);
                        setCart(res.data.items.map(i => ({ ...i, _id: i.menuItem })));
                        setRestaurantId(res.data.restaurant);
                        setRestaurantName(res.data.restaurantName);
                    }
                } catch (err) {
                    console.error("Failed to fetch cart", err);
                } finally {
                    // Mark as loaded whether we found items or not, so future changes can sync
                    setIsCartLoaded(true);
                }
            } else {
                // Only clear if we are SURE there is no user and not loading
                setCart([]);
                setIsCartLoaded(false); // Reset on logout
            }
        };
        fetchCart();
    }, [currentUser, loading]);

    // Sync cart to backend whenever it changes
    useEffect(() => {
        // CRITICAL FIX: Only sync if we have finished the initial load.
        // Otherwise, the initial empty state '[]' will overwrite the DB data.
        if (currentUser && isCartLoaded) {
            const syncCart = async () => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    await axios.post(`${apiUrl}/cart`, {
                        firebaseUid: currentUser.uid,
                        restaurantId,
                        restaurantName,
                        items: cart.map(item => ({
                            menuItem: item._id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            quantity: item.quantity
                        }))
                    });
                } catch (err) {
                    console.error("Failed to sync cart", err);
                }
            };
            // Debounce slightly to avoid too many writes
            const timeout = setTimeout(syncCart, 1000);
            return () => clearTimeout(timeout);
        }
    }, [cart, currentUser, restaurantId, restaurantName, isCartLoaded]);

    useEffect(() => {
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setCartTotal(total);
    }, [cart]);

    const addToCart = (item, restId, restName) => {
        // Check if adding item from a different restaurant
        if (cart.length > 0 && restaurantId !== restId) {
            if (!window.confirm("Start a new basket? Orders cannot be placed from multiple restaurants at once.")) {
                return;
            }
            setCart([]);
        }

        setRestaurantId(restId);
        setRestaurantName(restName);

        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== itemId));
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item => item._id === itemId ? { ...item, quantity: newQuantity } : item)
        );
    };

    const clearCart = () => {
        setCart([]);
        setRestaurantId(null);
        setRestaurantName(null);
    };

    const value = {
        cart,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        restaurantId
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
