import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Unavbar from './Unavbar';
import { Button } from 'react-bootstrap';

const Uitem = () => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        axios.get(`http://localhost:4000/item/${id}`)
            .then((resp) => {
                console.log('Item data received:', resp.data);
                setItem(resp.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch item data:", error);
                setError('Failed to load item details');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div>
                <Unavbar />
                <div className="text-center mt-8">
                    <p>Loading item details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Unavbar />
                <div className="text-center mt-8">
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div>
                <Unavbar />
                <div className="text-center mt-8">
                    <p>Item not found</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Unavbar />
            <br />
            <div>
                {/* Book Image */}
                <div style={{ display: "flex", justifyContent: "center", height: "450px", marginBottom: "20px" }}>
                    <img 
                        src={`http://localhost:4000/${item.itemImage}`} 
                        alt={`${item.title || item.itemtype} Cover`}
                        style={{ 
                            maxHeight: "100%", 
                            maxWidth: "300px", 
                            objectFit: "contain",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                        }}
                        onError={(e) => {
                            // Fallback image if the original fails to load
                            e.target.src = 'https://via.placeholder.com/300x450?text=Book+Cover+Not+Available';
                        }}
                    />
                </div>
                
                {/* Book Title */}
                <h1 className='text-center' style={{ marginBottom: "30px", fontSize: "32px", fontWeight: "bold" }}>
                    {item.title || item.itemtype}
                    {item._id && <span style={{ fontSize: "16px", color: "gray" }}> - {item._id.slice(3, 7)}</span>}
                </h1>
                
                {/* Book Details */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: "40px" }}>
                    {/* Description Section */}
                    <div style={{ width: '38%', marginLeft: "150px" }}>
                        <h2 style={{ color: "grey", marginBottom: "10px" }}>
                            <strong>Description</strong>
                        </h2>
                        <hr style={{ height: "3px", backgroundColor: "black", marginBottom: "15px" }} />
                        <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
                            {item.description || 'No description available'}
                        </p>
                    </div>
                    
                    {/* Info Section */}
                    <div style={{ marginRight: '300px' }}>
                        <h2 style={{ color: "grey", marginBottom: "10px" }}>
                            <strong>Book Details</strong>
                        </h2>
                        <hr style={{ height: "3px", backgroundColor: "black", marginBottom: "15px" }} />
                        
                        <div style={{ fontSize: "18px" }}>
                            <p style={{ marginBottom: "10px" }}>
                                <strong>Title:</strong> {item.title || 'N/A'}
                            </p>
                            <p style={{ marginBottom: "10px" }}>
                                <strong>Author:</strong> {item.author || 'N/A'}
                            </p>
                            <p style={{ marginBottom: "10px" }}>
                                <strong>Genre:</strong> {item.genre || 'N/A'}
                            </p>
                            <p style={{ marginBottom: "10px", fontSize: "22px", color: "#007bff" }}>
                                <strong>Price: ₹{item.price}</strong>
                            </p>
                            <p style={{ marginBottom: "10px" }}>
                                <strong>Seller:</strong> {item.userName || 'N/A'}
                            </p>
                            <p style={{ marginBottom: "10px", fontSize: "14px", color: "green" }}>
                                <strong>✓ Free Delivery Available</strong>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Buy Now Button */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
                    <Link 
                        to={`/orderitem/${item._id}`} 
                        style={{ textDecoration: "none" }}
                    >
                        <button
                            type="button"
                            style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                fontSize: "18px",
                                fontWeight: "600",
                                padding: "12px 30px",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
                        >
                            🛒 Buy Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Uitem;