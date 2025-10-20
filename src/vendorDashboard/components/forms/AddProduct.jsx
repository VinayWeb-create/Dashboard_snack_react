import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (category.includes(value)) {
      setCategory(category.filter((item) => item !== value));
    } else {
      setCategory([...category, value]);
    }
  };

  const handleBestSeller = (event) => {
    setBestSeller(event.target.value === 'true');
  };

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginToken = localStorage.getItem('loginToken');
      const firmId = localStorage.getItem('firmId');

      if (!loginToken || !firmId) {
        alert("You are not authenticated or firm not selected");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('bestSeller', bestSeller);
      formData.append('image', image);

      category.forEach((cat) => formData.append('category', cat));

      const response = await fetch(`${API_URL}/product/add-product/${firmId}`, {
        method: 'POST',
        headers: {
          token: loginToken, // ✅ send the token here
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        setProductName("");
        setPrice("");
        setCategory([]);
        setBestSeller(false);
        setImage(null);
        setDescription("");
      } else {
        alert(data.error || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="firmSection">
      {loading && (
        <div className="loaderSection">
          <ThreeCircles visible={loading} height={100} width={100} color="#4fa94d" />
          <p>Please wait, your product is being added...</p>
        </div>
      )}
      {!loading && (
        <form className="tableForm" onSubmit={handleAddProduct}>
          <h3>Add Product</h3>
          <label>Product Name</label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />

          <label>Price</label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />

          <div className="checkInp">
            <label>Category</label>
            <div className="inputsContainer">
              <div className="checboxContainer">
                <label>Veg</label>
                <input type="checkbox" value="veg" checked={category.includes('veg')} onChange={handleCategoryChange} />
              </div>
              <div className="checboxContainer">
                <label>Non-Veg</label>
                <input type="checkbox" value="non-veg" checked={category.includes('non-veg')} onChange={handleCategoryChange} />
              </div>
            </div>
          </div>

          <div className="checkInp">
            <label>Best Seller</label>
            <div className="inputsContainer">
              <div className="checboxContainer">
                <label>Yes</label>
                <input type="radio" value="true" checked={bestSeller === true} onChange={handleBestSeller} />
              </div>
              <div className="checboxContainer">
                <label>No</label>
                <input type="radio" value="false" checked={bestSeller === false} onChange={handleBestSeller} />
              </div>
            </div>
          </div>

          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

          <label>Product Image</label>
          <input type="file" onChange={handleImageUpload} />

          <div className="btnSubmit">
            <button type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddProduct;
