import React, { useState } from "react";
import { POST } from "../api";
import { Link } from "react-router-dom";

const Customers = () => {
  // Store form input values
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Handle input changes and update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create new customer
    const customer = {
      name: customerInfo.firstName + " " + customerInfo.lastName,
      email: customerInfo.email,
    };

    const response = await POST("/customer", {
      body: JSON.stringify(customer),
    }).then((val) => val.json());
    console.log(response);

    // Reset form after submission
    setCustomerInfo({
      firstName: "",
      lastName: "",
      email: "",
    });
  };

  return (
    <div>
      <div>
        <h2>Create a New Customer</h2>
        <Link to="/">Home</Link>
      </div>
      <hr className="solid" />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={customerInfo.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={customerInfo.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Customers;
