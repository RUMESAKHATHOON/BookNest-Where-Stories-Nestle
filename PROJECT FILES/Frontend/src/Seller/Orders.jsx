import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import Snavbar from './Snavbar';

function Orders() {
  const [orders, setOrders] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      axios
        .get(`${API}/getsellerorders/${user.id}`)
        .then((response) => {
          console.log('Fetched orders:', response.data);
          setOrders(response.data);
        })
        .catch((error) => {
          console.error('Error fetching orders:', error);
        });
    } else {
      console.error('User not logged in.');
    }
  }, []);

  const calculateStatus = (Delivery) => {
    const currentDate = new Date();
    const deliveryDate = new Date(Delivery);
    return deliveryDate >= currentDate ? 'On the way' : 'Delivered';
  };

  return (
    <div>
      <Snavbar />
      <div className="container mx-auto p-8">
        <h3 className="text-3xl font-semibold mb-6 text-center">Orders</h3>
        {orders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          orders.map((item) => {
            const status = calculateStatus(item.Delivery);
            const imageUrl = item.itemImage
              ? `${API}/uploads/${item.itemImage}`
              : '/placeholder.jpg';

            return (
              <Card
                key={item._id}
                className="mb-6"
                style={{
                  width: '95%',
                  margin: '0 auto',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                      alt={item.itemname || 'Product'}
                      style={{ height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <p><strong>Product Name:</strong></p>
                    <p>{item.itemname || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Order ID:</strong></p>
                    <p>{item._id.slice(0, 10)}</p>
                  </div>
                  <div>
                    <p><strong>Customer Name:</strong></p>
                    <p>{item.userName || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Address:</strong></p>
                    <p>{item.flatno}, {item.city} ({item.pincode}), {item.state}</p>
                  </div>
                  <div>
                    <p><strong>Booking Date:</strong></p>
                    <p>{new Date(item.BookingDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><strong>Delivery By:</strong></p>
                    <p>{new Date(item.Delivery).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><strong>Warranty:</strong></p>
                    <p>1 year</p>
                  </div>
                  <div>
                    <p><strong>Price:</strong></p>
                    <p>₹{item.totalamount || '0'}</p>
                  </div>
                  <div>
                    <p><strong>Status:</strong></p>
                    <p>{status}</p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Orders;
