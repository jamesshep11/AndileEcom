import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Link to="/customers">Add Customer</Link>
      <tr />
      <Link to="/products">Products</Link>
      <tr />
      <Link to="/orders">Order History</Link>
    </div>
  );
}
