import React,{useEffect, useState} from 'react'
import "./style.css"
function Sort({callback}) {
    const [sort, setSort] = useState("none")
    useEffect(()=>{
        if(sort != "none"){
            callback(sort)
        }
    },[sort])
    return (
        <select name="sort" id="sort" className='sort' value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="none" disabled>Sort By ...</option>
            <option value="price_high_low">By Price High To Low</option>
            <option value="price_low_high">By Price low To High</option>
            <option value="newest">By Newest</option>
        </select>
    )
}

export default Sort