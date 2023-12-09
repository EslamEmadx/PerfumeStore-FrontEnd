import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { createOrder } from './apiCore';
import { emptyCart } from './cartHelpers';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: '',
    address: '',
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;


  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const buy = () => {
    setData({ loading: true });

    // Check if the cart is empty before creating the order
    if (products.length === 0) {
      setData({
        loading: false,
        success: false,
        error: 'Your cart is empty. Add some products before placing an order.',
      });
      return;
    }

    const createOrderData = {
      products: products,
      amount: getTotal(products),
      address: data.address,
      status: 'Cash On Delivery',
      createdAt:new Date(),

    };

    createOrder(userId, token, createOrderData)
      .then((response) => {
        emptyCart(() => {
          setRun(!run);
          console.log('Order created successfully');
          setData({
            loading: false,
            success: true,
          });
        });
      })
      .catch((error) => {
        console.log(error);
        setData({ loading: false });
      });
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>
        <Button onClick={buy} variant='contained' color='primary'>
          Place Order
        </Button>
      </div>
    ) : (
      <Link to='/signin'>
        <Button variant='contained' color='primary'>
          Sign in to checkout
        </Button>
      </Link>
    );
  };

  const showSuccess = (success) => (
    <div className='alert alert-info' style={{ display: success ? '' : 'none' }}>
      Thanks! Your order was successful!
                                        
      Your Order Will Deliverd in 3 Days
    </div>
  );

  const showLoading = (loading) =>
    loading && <h2 className='text-danger'>Loading...</h2>;

  const showEmptyCartMessage = () => (
    <div className='alert alert-warning'>
      Your cart is empty. Add some products before placing an order.
    </div>
  );

  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {products.length === 0 && showEmptyCartMessage()}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
