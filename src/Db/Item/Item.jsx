import React, { useState, useEffect, useRef } from 'react'
import "../style.css"

function Item({ data, Update, Delete, refreshKey }) {
    const [formData, setFormData] = useState({
        id: data.id || "",
        section: data.section || "",
        image: data.image || "",
        title: data.title || "",
        desc: data.desc || "",
        price: data.price || "",
        avgreview: data.avgreview || ""
    });
    const [isUpdated, setIsUpdated] = useState(true);

    const initialData = useRef({
        id: data.id || "",
        section: data.section || "",
        image: data.image || "",
        title: data.title || "",
        desc: data.desc || "",
        price: data.price || "",
        avgreview: data.avgreview || ""
    });

    const fileInputRef = useRef();
    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };
    const checkUpdate = () => {
        const changed =
            initialData.current.image !== formData.image ||
            initialData.current.title !== formData.title ||
            initialData.current.desc !== formData.desc ||
            initialData.current.price !== formData.price ||
            initialData.current.avgreview !== formData.avgreview;


        setIsUpdated(!changed);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            handleChange("image", reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleImageClick = () => fileInputRef.current.click();

    useEffect(() => {
        checkUpdate();
    }, [formData]);

    useEffect(() => {
        setFormData({
        id: data.id || "",
        image: data.image || "",
        section: data.section || "",
        title: data.title || "",
        desc: data.desc || "",
        price: data.price || "",
        avgreview: data.avgreview || ""
    });
        initialData.current = {
        id: data.id || "",
        image: data.image || "",
        section: data.section || "",
        title: data.title || "",
        desc: data.desc || "",
        price: data.price || "",
        avgreview: data.avgreview || ""
    };
        setIsUpdated(true);
    }, [refreshKey]);
    return (
        <div className={`item ${isUpdated ? "" : " updated"}`} key={formData.id}>
            <input type="text" value={formData.id} readOnly />
            <input type="text" value={formData.section} readOnly />
            <img src={formData.image} alt={formData.title} onClick={handleImageClick} />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
            />
            <textarea value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
            <textarea value={formData.desc} onChange={(e) => handleChange("desc", e.target.value)} />
            <input value={formData.price} onChange={(e) => handleChange("price", e.target.value)} />
            <input value={formData.avgreview} onChange={(e) => handleChange("avgreview", e.target.value)} />
            <button className="update" disabled={isUpdated} onClick={() => Update(formData)}>
                Update
            </button>
            <button className="delete" onClick={() => Delete(formData.id)}>Delete</button>
        </div>
    );
}

export default Item;