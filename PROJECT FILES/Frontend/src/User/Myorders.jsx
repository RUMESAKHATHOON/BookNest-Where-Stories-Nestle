import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Seller/List.css';
import { Card } from 'react-bootstrap';
import Unavbar from './Unavbar';
import Footer from '../Componenets/Footer';

function Myorders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User:', user);

    if (user && user.id) {
      axios
        .get(`${API}/getorders/${user.id}`)
        .then((response) => {
          console.log('Orders fetched:', response.data);
          setOrders(response.data);
        })
        .catch((error) => {
          console.error('Error fetching orders:', error);
          setError('Failed to fetch your orders. Please try again.');
        })
        .finally(() => setLoading(false));
    } else {
      setError('User not logged in.');
      setLoading(false);
    }
  }, []);

  const calculateStatus = (deliveryDate) => {
    const currentDate = new Date();
    const delivery = new Date(deliveryDate);
    return delivery >= currentDate ? 'On the way' : 'Delivered';
  };

  return (
    <div>
      <Unavbar />
      <div>
        <h1 className='text-center'>My Orders</h1>
        {loading && <p className='text-center'>Loading your orders...</p>}
        {error && <p className='text-center text-danger'>{error}</p>}
        {orders.length === 0 && !loading && !error && (
          <p className='text-center'>No orders found.</p>
        )}

        <div>
          {orders.map((order) => {
            const status = calculateStatus(order.Delivery);
            const imageUrl = order.itemImage
              ? `${API}/uploads/${order.itemImage}`
              : '/placeholder.jpg';

            return (
              <Card
                key={order._id}
                style={{
                  width: '90%',
                  margin: '20px auto',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  padding: '15px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <img
                      src={imageUrl}
                      alt={order.itemname || 'Product'}
                      style={{ height: '120px', width: '100px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ maxWidth: '500px', textAlign: 'left' }}>
                    <p><strong>Product Name:</strong> {order.itemname || 'N/A'} - {order._id.slice(3, 7)}</p>
                    <p><strong>Order ID:</strong> {order._id.slice(0, 10)}</p>
                    <p><strong>Address:</strong> {order.flatno}, {order.city} ({order.pincode}), {order.state}</p>
                    <p><strong>Seller:</strong> {order.seller || 'N/A'}</p>
                    <p><strong>Booking Date:</strong> {new Date(order.BookingDate).toLocaleDateString()}</p>
                    <p><strong>Delivery By:</strong> {new Date(order.Delivery).toLocaleDateString()}</p>
                    <p><strong>Price:</strong> ₹{order.totalamount || '0'}</p>
                    <p><strong>Status:</strong> {status}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Myorders;
