import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snavbar from './Snavbar';
import { FaTrash } from "react-icons/fa";

function Myproducts() {
  const [items, setItems] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      axios
        .get(`${API}/getitem/${user.id}`)
        .then((response) => {
          console.log('Fetched items:', response.data);
          setItems(response.data);
        })
        .catch((error) => {
          console.error('Error fetching items:', error);
        });
    } else {
      console.error('User not logged in.');
    }
  }, []);

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/itemdelete/${id}`);
      // Update state locally without full reload
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      alert('Item has been deleted.');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    }
  };

  return (
    <div>
      <Snavbar />
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-semibold mb-4 text-center">My Listed Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded shadow relative">
              <button
                onClick={() => deleteItem(item._id)}
                style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'none', color: 'red' }}
                title="Delete Item"
              >
                <FaTrash />
              </button>
              <img
                src={`${API}/uploads/${item.itemImage}`}
                alt={item.title}
                className="rounded-t-lg"
                style={{ height: "350px", width: "100%", objectFit: "cover" }}
              />
              <div className="mt-4">
                <p className="text-xl font-bold mb-2">{item.title}</p>
                {item.author && <p className="text-gray-700 mb-2">Author: {item.author}</p>}
                {item.genre && <p className="text-gray-700 mb-2">Genre: {item.genre}</p>}
                {item.price && <p className="text-blue-500 font-bold mb-2">Price: {item.price}</p>}
                {item.description && (
                  <p className="text-gray-600">
                    <strong>Description:</strong> {item.description.length > 250 ? `${item.description.slice(0, 250)}...` : item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Myproducts;
