import React, { useState, useEffect } from "react";
import { GET, POST } from "../api";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all products from your API
  const fetchData = async () => {
    // If no filter, then get all orders
    if (!searchTerm) {
      const orders = await POST("/orders").then((val) => val.json());
      setOrders(orders);
      return;
    }

    // First check order Id
    let body = JSON.stringify({ ids: [searchTerm] });
    let orders = await POST("/orders", { body: body }).then((val) =>
      val.json()
    );

    // If no orders, then check customer id
    if (orders.length === 0) {
      body = JSON.stringify({ customerId: searchTerm });
      orders = await POST("/orders", { body: body }).then((val) => val.json());
    }

    // Set orders
    setOrders(orders);
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  // Watch search bar for changes
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div>
        <h1>Order Histoy</h1>
        <Link to="/">Home</Link>
        <div>
          <input
            type="text"
            placeholder="Search by order id or customer ID"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <hr className="solid" />
      {orders.map((order) => (
        <div>
          <div>
            <strong>Order ID:</strong> {order.id}
          </div>
          <div>
            <strong>Customer Name:</strong> {order.customer.name}
          </div>
          <div>
            <strong>Customer Email:</strong> {order.customer.email}
          </div>
          <div>
            <strong>Paid:</strong> {order.paid ? "Yes" : "No"}
          </div>
          <div>
            <strong>Total:</strong> R{order.total}
          </div>
          <div>
            <strong>Products:</strong>
            <ul>
              {order.products.map((product) => (
                <li key={product.id}>
                  <strong>Name:</strong> {product.name}
                  <br />
                  <strong>Description:</strong> {product.description}
                  <br />
                  <strong>Price:</strong> R{product.price}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Created At:</strong>{" "}
            {new Date(order.CreatedAt * 1000).toLocaleString()}
          </div>
          <div>
            <strong>Updated At:</strong>{" "}
            {new Date(order.UpdatedAt * 1000).toLocaleString()}
          </div>
          <hr className="solid" />
        </div>
      ))}
    </div>
  );
};

export default Orders;
