import React, { useContext, useEffect, useRef, useState } from 'react'
import "./style.css"
import upload_img from "../../Assets/upload.png"
import AlertContext from '../../../Context/AlertContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
function EditProduct() {
  const fileInputRef = useRef();
  const navigate = useNavigate()
  const { setAlert, setAlertSt } = useContext(AlertContext)
  const { productid } = useParams()
  const [image, setImage] = useState(upload_img);
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [id, setId] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) convertToBase64(file);
  };

  const callProduct = async () => {
    try {
      let data = await axios.get(`http://localhost:5000/products/${productid}`)
      setProduct(data.data)
      setId(productid)
      setImage(data.data.image)
      setTitle(data.data.title)
      setDesc(data.data.desc)
      setPrice(data.data.price)
    } catch (e) {
      console.log(e);
      
    }
  }

  useEffect(() => {
    callProduct()
  }, [])


  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // console.log("Base64:", reader.result);
      setImage(reader.result)
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) convertToBase64(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };




  const handleSubmit = async () => {
    if (image === upload_img) { setError("Upload A New Image..."); return; }
    if (!title) { setError("Title Field Is Empty..."); return; }
    if (!desc) { setError("Description Field Is Empty..."); return; }
    if (!price) { setError("Price Field Is Empty..."); return; }
    if (price < 10000) { setError("Price is Too Low..."); return; }

    let newProduct = {
      ...product,
      image,
      title,
      desc,
      price,
      timestamp: Date.now(),
    }

    try {
      let data = await axios.put(`http://localhost:5000/products/${productid}`, newProduct)
      setAlert("Product Updated. Id:" + id);
      setAlertSt("success")
      navigate("/Admin/UsedPc")
    } catch (e) {
      console.log(e)
      setAlert("Product is Not Added , Try Agian Later");
      setAlertSt("error")
    }

  }

  return (
    <div className="createproduct">
      <div className="content">
        <h2>Update {productid}</h2>
        <div
          className="file"
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <img src={image} alt="" className='upload' />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
        <textarea
          name="title"
          id="title"
          placeholder='Product Title Here...'
          className='title'
          rows={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></textarea>
        <textarea
          name="desc"
          id="desc"
          placeholder='Product Description Here...'
          className='desc'
          rows={5}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        ></textarea>
        <input
          type="number"
          name="price"
          id="price"
          placeholder='Price'
          className='price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {error && <pre className='err'>{error}</pre>}
        <button className='submit' onClick={handleSubmit}>Update Product</button>
      </div>
    </div>
  )
}

export default EditProduct