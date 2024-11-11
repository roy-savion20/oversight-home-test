import React, { useState, useEffect, useContext } from 'react';
import { ManagerContext } from '../context/Managercontext';

const ManagerProfile = () => {
  const { currentManager, setCurrentManager } = useContext(ManagerContext);
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: '',
    couponType: 'percentage', // default type
    expirationDate: '',
    allowMultipleUses: false,
    usageLimit: '',
  });


  //fetch all the coupons
  useEffect(() => {
    fetch('http://localhost:3001/coupons')
      .then((response) => response.json())
      .then((data) => setCoupons(data))
      .catch((err) => console.error('Error fetching coupons:', err));
  }, []);

  useEffect(() => {
    setCurrentManager(JSON.parse(sessionStorage.getItem('currentManager')));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  //handle the otion to add new coupon
  const handleAddCoupon = () => {
    const currentDate = new Date().toISOString();
    const newCoupon = {
      ...formData,
      id: Date.now(),
      managerId: currentManager.id,
      createdAt: currentDate,
    };

    fetch('http://localhost:3001/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCoupon),
    })
      .then(() => setCoupons([...coupons, newCoupon]))
      .then(() => setFormData({
        code: '', description: '', discount: '', couponType: 'percentage',
        expirationDate: '', allowMultipleUses: false, usageLimit: ''
      }))
      .catch((err) => console.error('Error adding coupon:', err));
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discount: coupon.discount,
      couponType: coupon.couponType || 'percentage', // set default if missing
      expirationDate: coupon.expirationDate || '',
      allowMultipleUses: coupon.allowMultipleUses || false,
      usageLimit: coupon.usageLimit || '',
    });
  };

  //function that handle the update coupons
  const handleUpdateCoupon = () => {
    const updatedCoupon = { ...editingCoupon, ...formData };
    fetch(`http://localhost:3001/coupons/${editingCoupon.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCoupon),
    })
      .then(() => setCoupons(coupons.map((c) => (c.id === editingCoupon.id ? updatedCoupon : c))))
      .then(() => {
        setEditingCoupon(null);
        setFormData({
          code: '', description: '', discount: '', couponType: 'percentage',
          expirationDate: '', allowMultipleUses: false, usageLimit: '',
        });
      })
      .catch((err) => console.error('Error updating coupon:', err));
  };

  //function that handle the delete coupons
  const handleDeleteCoupon = (id) => {
    fetch(`http://localhost:3001/coupons/${id}`, { method: 'DELETE' })
      .then(() => setCoupons(coupons.filter((c) => c.id !== id)))
      .catch((err) => console.error('Error deleting coupon:', err));
  };

  return (
    <div className="manager-profile">
      <h2 className="manager-email">{currentManager.email}'s Coupons</h2>

      <div className="coupon-list">
        {coupons.map((coupon) => {
          if (coupon.managerId == currentManager.id) {
            return (
              <div key={coupon.id} className="coupon-card">
                <h3>{coupon.code}</h3>
                <p>{coupon.description}</p>
                <p>Discount: {coupon.discount} {coupon.couponType === 'percentage' ? '%' : '₪'}</p>
                {coupon.expirationDate && <p>Expiration Date: {new Date(coupon.expirationDate).toLocaleDateString()}</p>}
                {coupon.allowMultipleUses && <p>Allows Multiple Uses</p>}
                {coupon.usageLimit && <p>Usage Limit: {coupon.usageLimit} times</p>}
                <button onClick={() => handleEditCoupon(coupon)} className='edit-delete-button'>Edit</button>
                <button onClick={() => handleDeleteCoupon(coupon.id)} className='edit-delete-button'>Delete</button>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="coupon-form">
        <h3>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h3>
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={formData.code}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount"
          value={formData.discount}
          onChange={handleInputChange}
        />
        <select
          name="couponType"
          value={formData.couponType}
          onChange={handleInputChange}
        >
          <option value="percentage">Percentage</option>
          <option value="amount">Amount</option>
        </select>
        <input
          type="date"
          name="expirationDate"
          placeholder="Expiration Date"
          value={formData.expirationDate}
          onChange={handleInputChange}
        />
        <label>
          <input
            type="checkbox"
            name="allowMultipleUses"
            checked={formData.allowMultipleUses}
            onChange={handleInputChange}
          />
          Allow Multiple Uses
        </label>
        <input
          type="number"
          name="usageLimit"
          placeholder="Usage Limit"
          value={formData.usageLimit}
          onChange={handleInputChange}
        />
        <button onClick={editingCoupon ? handleUpdateCoupon : handleAddCoupon}>
          {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
        </button>
      </div>
    </div>
  );
};

export default ManagerProfile;