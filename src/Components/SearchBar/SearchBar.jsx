import React, { useState, useEffect, useRef } from 'react'
import "./style.css"
import axios from 'axios'
import searchicon from "../../Assets/icons8-search-48.png"
function SearchBar({ type, callback }) {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState("")
  const inputRef = useRef(null);

  let callproducts = async () => {
    if (!type) return;
    try {
      let res = await axios.get(`http://localhost:5000/products?section=${type}`)
      setProducts(res.data)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    callproducts()
  }, [type])

  const callSearch = (e) => {
    if (e.key === "Enter") {
      callback(search);
      inputRef.current?.blur();
    }
  }
  return (
    <div className="searchbar">
      <input
        type="search"
        name="search"
        id="searchinput"
        value={search}
        placeholder="Search Here ..."
        list="datalists"
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={callSearch}
        ref={inputRef}
      />
      <button onClick={() => { callback(search) }}> <img src={searchicon} alt="" /></button>
      <datalist id="datalists">
        {type && [...products].map((suggestion, index) => (
          <option key={index} value={suggestion.title} />
        ))}
      </datalist>
    </div>
  )
}

export default SearchBar