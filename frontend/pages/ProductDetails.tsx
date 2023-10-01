import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GET, POST, PUT } from "../api";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  // Load product details
  const getProductDetails = async () => {
    const product: {} = await GET("/product/" + id).then((val) => val.json());
    setProduct(product);
    setEditedProduct(product);
  };

  useEffect(() => {
    getProductDetails();
  }, [id]);

  // Map changes to editedProduct to be saved
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  // Cancel changes
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedProduct(product); // Reset the edited product to the original product
  };

  // Save changes
  const handleSaveClick = async () => {
    const productToSave = {
      name: editedProduct.name,
      description: editedProduct.description,
      price: parseInt(editedProduct.price),
    };

    const result = await PUT("/product/" + id, {
      body: JSON.stringify(productToSave),
    }).then((val) => val.json());

    await getProductDetails();
    setIsEditing(false);
  };

  // Delete product and redirect to product list
  const navigate = useNavigate();

  const handleDelete = async () => {
    const result = await POST("/remove-products", {
      body: JSON.stringify({ ids: ["" + id] }),
    }).then((val) => val.json());

    navigate("/products");
  };

  return (
    <div>
      <div>
        <h2>Product Details</h2>
        <Link to="/products">Back</Link>
      </div>
      <hr className="solid" />
      {isEditing ? (
        <div>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedProduct.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={editedProduct.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={editedProduct.price}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      ) : (
        <div>
          <div>
            <strong>Name:</strong> {product.name}
          </div>
          <div>
            <strong>Description:</strong> {product.description}
          </div>
          <div>
            <strong>Price:</strong> R{product.price}
          </div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => handleDelete()}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
