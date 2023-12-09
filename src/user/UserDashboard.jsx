// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { getUserPurchaseHistory } from './apiUser';

const Dashboard = () => {
  const [history, setHistory] = useState([]);

  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const token = isAuthenticated().token;

  const init = (userId, token) => {
    getUserPurchaseHistory(userId, token)
      .then((data) => {
        console.log(data); // Log the API response for debugging
        if (data && data.error) {
          console.log('Error fetching purchase history:', data.error);
        } else {
          setHistory(data || []);
        }
      })
      .catch((err) => console.log('Error fetching purchase history:', err));
  };

  useEffect(() => {
    init(_id, token);
  }, [_id, token]);

  const userLinks = () => (
    <div className='card'>
      <h4 className='card-header'>User links</h4>
      <ul className='list-group'>
        <li className='list-group-item'>
          <Link className='nav-link' to='/cart'>
            My cart
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to={`/profile/${_id}`}>
            Update profile
          </Link>
        </li>
      </ul>
    </div>
  );

  const userInfo = () => (
    <div className='card mb-5'>
      <h3 className='card-header'>User information</h3>
      <ul className='list-group'>
        <li className='list-group-item'>{name}</li>
        <li className='list-group-item'>{email}</li>
        <li className='list-group-item'>
          {role === 1 ? 'Admin' : 'Registered user'}
        </li>
      </ul>
    </div>
  );

  const purchaseHistory = (history) => (
    <div className='card mb-5'>
      <h3 className='card-header'>Purchase history</h3>
      {Array.isArray(history) && history.length === 0 ? (
        <p className='card-body'>You have no purchase history.</p>
      ) : (
        <ul className='list-group'>
          {history.map((purchase, index) => (
            <li className='list-group-item' key={index}>

              
                <ul>
                    <li >
                      <h6>Product name: {purchase.name}</h6>
                      <h6>Product price: {purchase.amount}$</h6>
                      <h6>Quantity: {purchase.quantity}</h6>
                    </li>

                </ul>
               
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
  
  

  return (
    <Layout
      title='Dashboard'
      description={`Welcome, ${name}`}
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-md-3'>{userLinks()}</div>
        <div className='col-md-9'>
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
