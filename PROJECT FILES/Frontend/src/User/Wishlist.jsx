// Wishlist.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Unavbar from './Unavbar';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios
        .get(`${API}/wishlist/${user.id}`)
        .then((response) => setWishlist(response.data))
        .catch((error) => console.error('Error fetching wishlist items:', error));
    } else {
      console.error('User not found in localStorage.');
    }
  }, []);

  const removeFromWishlist = async (itemId) => {
    try {
      await axios.post(`${API}/wishlist/remove`, { itemId });

      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const response = await axios.get(`${API}/wishlist/${user.id}`);
        setWishlist(response.data);
      } else {
        console.error('User not found in localStorage.');
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  return (
    <div>
      <Unavbar />
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-semibold mb-4 text-center">Wishlist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded shadow">
              <img
                src={`${API}/uploads/${item.itemImage}`}
                alt={item.title}
                className="rounded-t-lg"
                style={{ height: '350px', width: '100%', objectFit: 'cover' }}
              />
              <div className="mt-4">
                <p className="text-xl font-bold mb-2">{item.title}</p>
                {item.author && <p className="text-gray-700 mb-2">Author: {item.author}</p>}
                {item.genre && <p className="text-gray-700 mb-2">Genre: {item.genre}</p>}
                {item.price && <p className="text-blue-500 font-bold mb-2">Price: {item.price}</p>}

                <Button
                  style={{ backgroundColor: 'red', border: 'none' }}
                  onClick={() => removeFromWishlist(item.itemId)}
                  className="mb-2"
                >
                  Remove from Wishlist
                </Button>

                <Link to={`/uitem/${item.itemId}`}>
                  <Button style={{ backgroundColor: 'rebeccapurple', border: 'none', color: 'white' }}>
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
