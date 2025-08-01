import React, { useState } from "react";
import axios from "axios";
import "./style.css"
function AddProduct({ onProductAdded }) {
  const [id, setId] = useState("");
  const [section, setSection] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const GetId = async (section) => {
    let lastid = "00000";
    try {
      const res = await axios.get("http://localhost:5000/products");
      const products = res.data.filter((p) => p.id.startsWith(getPrefix(section)));
      if (products.length > 0) {
        const lastProduct = products[products.length - 1];
        let ids = lastProduct.id.slice(2);
        lastid = String(Number(ids) + 1).padStart(5, "0");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setId(getPrefix(section) + lastid);
  };

  const getPrefix = (section) => {
    if (section === "Laptop") return "LP";
    if (section === "Pc") return "PC";
    if (section === "Pc Parts") return "PP";
    return "XX";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !title || !desc || !price || !imageBase64) {
      alert("Please fill all fields");
      return;
    }

    const newProduct = {
      id,
      section,
      title,
      desc,
      price: parseFloat(price),
      image: imageBase64,
      avgreview: "0",
      timestamp: Date.now()
    };

    await axios.post("http://localhost:5000/products", newProduct);

    setSection();
    setId("");
    setTitle("");
    setDesc("");
    setPrice("");
    setImageBase64("");
  };

  return (
    <div className="div">
      <form onSubmit={handleSubmit}>
        <div className="radio">
          <input type="radio" name="section" id="Laptop" value="Laptop" onChange={(e) => {
            const value = e.target.value;
            setSection(value);
            GetId(value);
          }} />
          <label htmlFor="section">Laptop</label>
          <input type="radio" name="section" id="Pc" value="Pc" onChange={(e) => {
            const value = e.target.value;
            setSection(value);
            GetId(value);
          }} />
          <label htmlFor="section">Pc</label>
          <input type="radio" name="section" id="PcParts" value="Pc Parts" onChange={(e) => {
            const value = e.target.value;
            setSection(value);
            GetId(value);
          }} />
          <label htmlFor="section">Pc Parts</label>
        </div>
        <input value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" required readOnly />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" required />
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Price" required />
        <input type="file" accept="image/*" onChange={handleImageUpload} required />
        {imageBase64 && <img src={imageBase64} alt="Preview" width="100" />}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
