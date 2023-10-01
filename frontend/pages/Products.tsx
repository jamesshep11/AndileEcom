import React, { useState, useEffect } from "react";
import { POST } from "../api";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedProducts, setSelectedProducts] = useState([]);

  // Fetch all products from your API
  const fetchData = async () => {
    try {
      const data = await POST("/products").then((val) => val.json());
      setProducts(data);

      // Calculate the total number of pages based on the page size
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setSelectedProducts([]);
  }, [pageSize]);

  // Function to paginate the data
  const paginateData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return products.slice(startIndex, endIndex);
  };

  const toggleProductSelection = (productId: never) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const handleBulkDelete = async () => {
    // You can implement the logic for bulk deletion here
    // This could involve making an API request to delete selected products
    // const prodctsToDelete = selectedProducts
    const productIds = { ids: selectedProducts.map((id) => String(id)) };

    const result = await POST("/remove-products", {
      body: JSON.stringify(productIds),
    }).then((val) => val.json());

    console.log(result);

    setSelectedProducts([]);
    fetchData();
  };

  return (
    <div>
      <div>
        <h1>Product List</h1>
        <Link to="/">Home</Link>
      </div>
      <hr className="solid" />
      <button
        onClick={handleBulkDelete}
        disabled={selectedProducts.length === 0}
      >
        Bulk Delete
      </button>
      <table className="table">
        <thead>
          <th></th>
          <th>Id</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {paginateData().map((product) => (
            <tr key={product.id}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => toggleProductSelection(product.id)}
                  checked={selectedProducts.includes(product.id)}
                />
              </td>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>
                <Link to={"/product/" + product.id}>view</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {/* Pagination controls */}
        <ul className="pagination">
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => {
                setSelectedProducts([]);
                setCurrentPage(index + 1);
              }}
            >
              <span className="page-link">{index + 1}</span>
            </li>
          ))}
          <span>
            | Page Size:
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
              }}
            >
              {[1, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </span>
        </ul>
      </div>
    </div>
  );
};

export default Products;
