import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';



const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [filterByUser, setFilterByUser] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const apiUrl = import.meta.env.VITE_API_URL;

  //fetch all the users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  //fetch all the users when the page is reloading
  useEffect(() => {
    const getUsers = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };

    getUsers();
    console.log(users)
  }, []);

  useEffect(() => {
    // fetch all coupons on component mount
    fetch(`${apiUrl}/coupons`)
      .then((response) => response.json())
      .then((data) => setCoupons(data))
      .catch((err) => console.error('Error fetching coupons:', err));
  }, []);

  const handleUserFilter = (e) => {
    const userId = e.target.value;
    setFilterByUser(userId);
    if (userId) {
      setFilteredCoupons(coupons.filter((coupon) => coupon.managerId === userId));
    } else {
      setFilteredCoupons(coupons);
    }
  };

  // function to filter by date the coupons
  const handleDateRangeFilter = () => {
    const { start, end } = dateRange;
    if (start && end) {
      const filtered = coupons.filter((coupon) => {
        const createdDate = new Date(coupon.createdAt);
        return createdDate >= new Date(start) && createdDate <= new Date(end);
      });
      setFilteredCoupons(filtered);
    }
  };

  // function to export the coupons to excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCoupons);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Coupons');
    XLSX.writeFile(workbook, 'coupons_report.xlsx');
  };


  // function to handle new user creation
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // call the fake api
    fetch(`${apiUrl}/users`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers([...users, data]); // update the user list
        setEmail('');
        setPassword('');
        alert('User created successfully!');
      })
      .catch((err) => {
        setError('Error creating user, please try again.');
      });
  };

  // handle logout
  const handleLogout = () => {
    navigate('/')
    alert('You have logged out');
  };

  return (
    <div className={`admin-container`}>
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="admin-form">
        <h3>Create New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Create User</button>
        </form>
        {error && <p className="error-msg">{error}</p>}
      </div>

      <div className="user-list">
        <h3>Users List</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
                {
                    (user.email !== 'admin@gmail.com') ? 
                    user.email : null
                }
            </li>
          ))}
        </ul>
      </div>
      <div className="admin-reports">
      <h2>Coupon Usage Reports</h2>

      {/* Filter by User */}
      <div className="filter-by-user">
        <label>
          Filter by User ID:
          <input
            type="text"
            value={filterByUser}
            onChange={handleUserFilter}
            placeholder="Enter User ID"
          />
        </label>
      </div>

      {/* Filter by Date Range */}
      <div className="filter-by-date-range">
        <label>
          Start Date:
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </label>
        <button onClick={handleDateRangeFilter}>Filter by Date Range</button>
      </div>

      {/* Coupon List */}
      <div className="coupon-list">
        <h3>Filtered Coupons</h3>
        {filteredCoupons.length > 0 ? (
          <ul>
            {filteredCoupons.map((coupon) => (
              <li key={coupon.id}>
                <strong>Code:</strong> {coupon.code} | <strong>Discount:</strong> {coupon.discount}% | 
                <strong> Created At:</strong> {new Date(coupon.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No coupons found for the selected criteria.</p>
        )}
      </div>

      {/* Export to Excel */}
      <button onClick={handleExportToExcel}>Export to Excel</button>
    </div>
    </div>
  );
};

export default Admin;