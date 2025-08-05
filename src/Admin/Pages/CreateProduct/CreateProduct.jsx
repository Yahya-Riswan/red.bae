import React, { useContext, useEffect, useRef, useState } from 'react'
import "./style.css"
import upload_img from "../../Assets/upload.png"
import AlertContext from '../../../Context/AlertContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
function CreateProduct() {
  const fileInputRef = useRef();
  const navigate = useNavigate()
  const { setAlert, setAlertSt } = useContext(AlertContext)
  const { type } = useParams()
  const [image, setImage] = useState(upload_img);
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("")
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) convertToBase64(file);
  };
  useEffect(()=>{GetId(type)},[])
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
    if (section === "PcParts") return "PP";
    return "XX";
  };

  const handleSubmit = async () => {
    if(image === upload_img){setError("Upload A New Image...");return;}
    if(!title){setError("Title Field Is Empty...");return;}
    if(!desc){setError("Description Field Is Empty...");return;}
    if(!price){setError("Price Field Is Empty...");return;}

    let newProduct = {
      id,
      section:type,
      image,
      title,
      desc,
      price,
      reviews:[],
      orders:[],
      avgreview: "0",
      timestamp: Date.now(),
      status:"active"
    }

    try {
      let data = await axios.post("http://localhost:5000/products",newProduct)
      setAlert("Product Added. Id:"+id);
      setAlertSt("success")
      if(type === "Pc"){
        navigate(`/Admin/UsedPc`)
      }else if(type === "Laptop"){
        navigate(`/Admin/UsedLaptop`)
      }else if(type === "PcParts"){
        navigate(`/Admin/PcParts`)
      }
    } catch (e) {
      console.log(e)
      setAlert("Product is Not Added , Try Agian Later");
      setAlertSt("error")
    }

  }

  return (
    <div className="createproduct">
      <div className="content">
        <h2>Add New Products to {type}</h2>
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
          onChange={(e)=>setTitle(e.target.value)}
        ></textarea>
        <textarea
          name="desc"
          id="desc"
          placeholder='Product Description Here...'
          className='desc'
          rows={5}
          value={desc}
          onChange={(e)=>setDesc(e.target.value)}
        ></textarea>
        <input
          type="number"
          name="price"
          id="price"
          placeholder='Price'
          className='price'
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
        />
        {error && <pre className='err'>{error}</pre>}
        <button className='submit' onClick={handleSubmit}>Add Product</button>
      </div>
    </div>
  )
}

export default CreateProduct