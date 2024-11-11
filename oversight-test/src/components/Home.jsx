import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [newPrice, setNewPrice] = useState(100); // Default price starts at 100
  const [discountApplied, setDiscountApplied] = useState(false);
  const navigate = useNavigate();

  // Fetch all the coupons
  useEffect(() => {
    fetch(`${apiUrl}/coupons`)
      .then(response => response.json())
      .then(data => setCoupons(data))
      .catch(err => console.error('Error fetching coupons:', err));
  }, []);

  // Function to handle the coupon application
  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code === couponCode);

    if (!coupon) {
      alert('Coupon not found.');
      return;
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      alert('This coupon has reached its usage limit.');
      return;
    }

    const updatedCoupon = {
      ...coupon,
      usageCount: (coupon.usageCount || 0) + 1
    };

    // Calculate the new price based on coupon type
    let updatedPrice = 100; // Start with the base price

    if (coupon.couponType === 'percentage') {
      updatedPrice = updatedPrice - (updatedPrice * (coupon.discount / 100)); // Apply percentage discount
    } else if (coupon.couponType === 'amount') {
      updatedPrice = updatedPrice - coupon.discount; // Apply fixed amount discount
    }

    // Update the price and coupons
    setCoupons(coupons.map(c => (c.id === coupon.id ? updatedCoupon : c)));
    setNewPrice(updatedPrice);
    setDiscountApplied(true);

    // Update coupon usage in the database
    fetch(`${apiUrl}/coupons/${coupon.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      body: JSON.stringify(updatedCoupon),
    })
      .then(() => alert('Coupon applied successfully!'))
      .catch(err => console.error('Error applying coupon:', err));

    // Reset discount status after 2 seconds
    setTimeout(() => setDiscountApplied(false), 2000);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home">
      <h2 className="title">Apply Your Coupon</h2>
      <input
        type="text"
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={e => setCouponCode(e.target.value)}
        className="coupon-input"
      />
      <button onClick={handleApplyCoupon} className="apply-button" disabled={discountApplied}>
        Apply Coupon
      </button>

      {discountApplied && <p className="success-message">Discount Applied Successfully!</p>}

      <div className="price-info">
        <p>Original Price: 100 ₪</p>
        <p>New Price: {newPrice} ₪</p>
      </div>

      <button onClick={handleLogin} className="login-button">
        Login
      </button>
    </div>
  );
};

export default Home;
