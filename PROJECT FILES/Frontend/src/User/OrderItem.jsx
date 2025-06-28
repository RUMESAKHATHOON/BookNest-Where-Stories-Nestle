import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../Seller/List.css';
import Unavbar from './Unavbar';

function OrderItem() {
  const [item, setItem] = useState({});
  const [formData, setFormData] = useState({
    flatno: '',
    city: '',
    pincode: '',
    state: '',
  });
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fixed: Use consistent port 4000
    axios.get(`http://localhost:4000/item/${id}`)
      .then((resp) => {
        console.log('Item data received:', resp.data);
        setItem(resp.data);
      })
      .catch((error) => {
        console.error("Failed to fetch item data:", error);
        alert('Failed to load item details. Please try again.');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.flatno || !formData.city || !formData.pincode || !formData.state) {
      alert('Please fill in all address fields');
      return;
    }

    try {
      // Check if user is logged in
      const user = localStorage.getItem('user');
      if (!user) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Ensure item is available and contains the required properties
      if (!item || !item.price) {
        alert('Item data is not available. Please try again.');
        return;
      }

      const deliveryFee = 15;
      const totalAmount = parseInt(item.price, 10) + deliveryFee;

      // Create order data
      const orderData = {
        ...formData,
        // Item details
        itemId: item._id,
        itemTitle: item.title || 'Unknown Title',
        itemAuthor: item.author || 'Unknown Author',
        itemGenre: item.genre || 'Unknown Genre',
        itemImage: item.itemImage || '',
        itemPrice: item.price,
        itemDescription: item.description || '',
        
        // Seller details
        sellerId: item.userId || '',
        sellerName: item.userName || 'Unknown Seller',
        
        // Order totals
        deliveryFee: deliveryFee,
        totalAmount: totalAmount,
        
        // User details
        userId: JSON.parse(user).id,
        userName: JSON.parse(user).name,
        
        // Order status
        orderStatus: 'pending',
        orderDate: new Date().toISOString()
      };

      console.log('Submitting order:', orderData);

      // Submit order
      const response = await axios.post('http://localhost:4000/userorder', orderData);
      
      if (response.status === 200 || response.status === 201) {
        alert('Order placed successfully!');
        navigate('/myorders');
      } else {
        throw new Error('Order submission failed');
      }
      
    } catch (error) {
      console.error('Error placing order:', error);
      
      if (error.response) {
        // Server responded with error
        alert(`Order failed: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        // Network error
        alert('Network error. Please check your connection.');
      } else {
        // Other error
        alert('Failed to place order. Please try again.');
      }
    }
  };

  // Show loading state
  if (!item || Object.keys(item).length === 0) {
    return (
      <div>
        <Unavbar />
        <div className="text-center mt-8">
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Unavbar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow-lg bg-white">
          <h2 className="text-2xl font-semibold text-center mb-4">Your order is almost Done!</h2>
          <p className="text-center mb-4">We just need a few more details before payment</p>
          
          <form onSubmit={handleSubmit}>
            <label className="block text-gray-600 text-center mb-4">Delivery Address:</label>
            
            {/* Flat/House Number */}
            <div className="mb-4">
              <div className="input-container">
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none" 
                  placeholder=" "
                  style={{width:"340px"}} 
                  name="flatno"
                  value={formData.flatno}
                  onChange={handleChange}
                  required
                />
                <label className="absolute left-2 transform -translate-y-1/2 bg-white px-1 pointer-events-none transition-transform">
                  House/Flat Number
                </label>
              </div>
            </div>

            {/* City and Pincode */}
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"16px"}}>
              <div className="input-container">
                <input 
                  type="text" 
                  className="p-2 border border-gray-300 rounded focus:outline-none" 
                  placeholder=" "
                  style={{width:"140px"}} 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <label className="absolute left-2 transform -translate-y-1/2 bg-white px-1 pointer-events-none transition-transform">
                  City
                </label>
              </div>
              
              <div className="input-container">
                <input 
                  type="text" 
                  className="p-2 border border-gray-300 rounded focus:outline-none" 
                  placeholder=" "
                  style={{width:"140px"}} 
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit pincode"
                  required
                />
                <label className="absolute left-2 transform -translate-y-1/2 bg-white px-1 pointer-events-none transition-transform">
                  Pincode
                </label>
              </div>
            </div>

            {/* State */}
            <div className="mb-4">
              <div className="input-container">
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none" 
                  placeholder=" "
                  style={{width:"340px"}} 
                  name="state"  
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <label className="absolute left-2 transform -translate-y-1/2 bg-white px-1 pointer-events-none transition-transform">
                  State
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              
              {/* Item image and details */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ width: "60px", height: "80px", overflow: "hidden" }}>
                  <img 
                    src={`http://localhost:4000/${item.itemImage}`} 
                    alt={item.title || 'Book cover'} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/60x80?text=No+Image';
                    }}
                  />
                </div>
                <div style={{ flex: 1, marginLeft: "10px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {item.title || 'Unknown Title'}
                  </p>
                  <p style={{ fontSize: "12px", color: "gray" }}>
                    by {item.author || 'Unknown Author'}
                  </p>
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ display:'flex', justifyContent:"space-between", marginBottom: "5px" }}>
                <p style={{ fontSize: "14px" }}>Book Price:</p>
                <p>₹{item.price}</p>
              </div>
              
              <div style={{ display:'flex', justifyContent:"space-between", marginBottom: "5px" }}>
                <p style={{ fontSize: "14px" }}>Delivery Fee:</p>
                <p>₹15</p>
              </div>
              
              <hr style={{ margin: "10px 0" }} />
              
              <div style={{ display:'flex', justifyContent:"space-between", fontWeight: "bold" }}>
                <p style={{ fontSize: "16px" }}>Total Amount:</p>
                <p>₹{parseInt(item.price, 10) + 15}</p>
              </div>
            </div>

            <button
              type="submit"
              style={{ width: "340px" }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>         
    </div>
  );
}

export default OrderItem;