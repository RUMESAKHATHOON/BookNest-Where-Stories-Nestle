import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Unavbar from './Unavbar';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Products() {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch all items
    axios.get(`${API}/item`)
      .then((response) => setItems(response.data))
      .catch((error) => console.error('Error fetching items:', error));

    // Fetch wishlist
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios.get(`${API}/wishlist/${user.id}`)
        .then((response) => setWishlist(response.data))
        .catch((error) => console.error('Error fetching wishlist:', error));
    }
  }, []);

  const addToWishlist = async (itemId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const selectedItem = items.find((item) => item._id === itemId);
    if (!selectedItem) return;

    try {
      await axios.post(`${API}/wishlist/add`, {
        itemId: selectedItem._id,
        title: selectedItem.title,
        itemImage: selectedItem.itemImage,
        userId: user.id,
        userName: user.name,
      });
      const response = await axios.get(`${API}/wishlist/${user.id}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (itemId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      await axios.post(`${API}/wishlist/remove`, { itemId });
      const response = await axios.get(`${API}/wishlist/${user.id}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isItemInWishlist = (itemId) => wishlist.some((item) => item.itemId === itemId);

  return (
    <div>
      <Unavbar />
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-semibold mb-4 text-center">Books List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded shadow">
              <img
                src={`${API}/uploads/${item.itemImage}`}
                alt={item.title}
                className="rounded-t-lg"
                style={{ height: '350px', width: '100%', objectFit: 'cover' }}
              />
              <div className="mt-4">
                <p className="text-xl font-bold mb-2">{item.title}</p>
                <p className="text-gray-700 mb-2">Author: {item.author}</p>
                <p className="text-gray-700 mb-2">Genre: {item.genre}</p>
                <p className="text-blue-500 font-bold mb-2">Price: {item.price}</p>

                {isItemInWishlist(item._id) ? (
                  <Button
                    style={{ backgroundColor: 'red', border: 'none' }}
                    onClick={() => removeFromWishlist(item._id)}
                    className="mb-2"
                  >
                    Remove from Wishlist
                  </Button>
                ) : (
                  <Button
                    style={{ backgroundColor: 'rebeccapurple', border: 'none' }}
                    onClick={() => addToWishlist(item._id)}
                    className="mb-2"
                  >
                    Add to Wishlist
                  </Button>
                )}

                <Link to={`/uitem/${item._id}`}>
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

export default Products;
