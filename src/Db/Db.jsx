import React, { useState, useEffect,} from 'react'
import axios from 'axios';
import "./style.css"
import Item from './Item/Item';
function Db() {
    const [items, setitems] = useState([])
    const [refreshKey, setRefreshKey] = useState(0);
   
    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/products");
            setitems(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const Update = async (formData) => {
        await axios.put(`${"http://localhost:5000/products"}/${formData.id}`, formData);
        setitems((prev) =>
            prev.map((item) => (item.id === formData.id ? { ...formData } : item))
        );
        setRefreshKey(prev => prev + 1);
    }
    const Delete = async (id) => {
        await axios.delete(`${"http://localhost:5000/products"}/${id}`);
        fetchData();
    }

    return (
        <div className="db">
            
            <div className='item' key={"head"}>
                <p>Id</p>
                <p>Section</p>
                <p>Image</p>
                <p>Title</p>
                <p>Description</p>
                <p>Price</p>
                <p>Avg Review</p>
                <p>Update</p>
                <p>Delete</p>
            </div>
            {
                items.map((data) => (
                    <Item key={data.id} data={data} Update={Update} Delete={Delete} refreshKey={refreshKey} />
                ))
            }

        </div>
    )
}

export default Db