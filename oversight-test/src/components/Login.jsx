import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { ManagerContext } from '../context/Managercontext';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [User,setUser] = useState({})
  const { setCurrentManager } = useContext(ManagerContext)
  const apiUrl = import.meta.env.VITE_API_URL;
  // formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      return errors;
    },
    onSubmit: (values) => {
      setError(''); // clear any previous errors

      // call the fake API to check if the user exists
      fetch(`${apiUrl}/users`)
        .then((response) => response.json())
        .then((users) => {
          // find the user matching the email and password
          const user = users.find(
            (user) => user.email === values.email && user.password === values.password
          );

          //check if the users is admin
          const admin = users.find(
            (user) => 'admin@gmail.com' === values.email && 'admin1234admin' === values.password
          )

          if(admin){
            alert('admin logged in')
            navigate('/admin'); 
            return;
          }
          if (user) {
            console.log('user values===>', user)
            setCurrentManager({user})
            sessionStorage.setItem('currentManager', JSON.stringify(user));
            navigate('/ManagerProfile')
            alert('Login successful');
          } else {
            // if user is not found show error
            setError('Invalid email or password');
          }
        })
        .catch((err) => {
          console.error('Error fetching users:', err);
          setError('An error occurred. Please try again later.');
        });
    },
  });

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={formik.touched.email && formik.errors.email ? 'input-error' : ''}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-message">{formik.errors.email}</div>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={formik.touched.password && formik.errors.password ? 'input-error' : ''}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" className="login-button-loginform ">
          Login
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;