import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const apiUrl = import.meta.env.VITE_API_URL;

  console.log(apiUrl);

  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const navigate = useNavigate();

  //fetch all the coupons
  useEffect(() => {
    fetch(`${apiUrl}/coupons`)
      .then(response => response.json())
      .then(data => setCoupons(data))
      .catch(err => console.error('Error fetching coupons:', err));
  }, []);

  //function that handle the coupon that apply by the costumer
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

    fetch(`${apiUrl}/coupons/${coupon.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json','Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      body: JSON.stringify(updatedCoupon),
    })
      .then(() => {
        setCoupons(coupons.map(c => (c.id === coupon.id ? updatedCoupon : c)));
        setDiscountApplied(true);
        alert('Coupon applied successfully!');
        setTimeout(() => setDiscountApplied(false), 2000);
      })
      .catch(err => console.error('Error applying coupon:', err));
  };

  const handleLogin = () => {
    navigate('/login')
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

      <button onClick={handleLogin} className="login-button">
        Login
      </button>
    </div>
  );
};

export default Home;