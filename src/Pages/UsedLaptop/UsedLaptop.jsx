import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Product from '../../Components/Product/Product'
import SearchBar from '../../Components/SearchBar/SearchBar'
import Sort from '../../Components/Sort/Sort'
function UsedPc() {
    const [products, setProducts] = useState([])
    const [error, setError] = useState(false)
    const [sort, setSort] = useState("none")
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    useEffect(() => {
        axios.get("http://localhost:5000/products?section=Laptop").then((res) => {
            if (search) {
                res.data = res.data.filter(product =>
                    product.title.toLowerCase().includes(search.toLowerCase())
                );
            }
            if (sort) {
                if (sort === 'price_high_low') {
                    res.data = res.data.sort((a, b) => b.price - a.price);
                } else if (sort === 'price_low_high') {
                    res.data = res.data.sort((a, b) => a.price - b.price);
                } else if (sort === "newest") {
                    res.data = res.data.sort((a, b) => b.timestamp - a.timestamp);
                }
            }
            if (filter) {
                let processedData = res.data; // Start with the full list

                // --- 1. Handle Keyword Filtering ---
                const activeKeywords = [];
                if (filter.amd) activeKeywords.push('amd');
                if (filter.intel) activeKeywords.push('intel');
                if (filter.eightram) activeKeywords.push('8 gb ram');
                if (filter.onesixram) activeKeywords.push('16 gb ram');
                if (filter.twofourram) activeKeywords.push('24 gb ram');
                if (filter.threetworam) activeKeywords.push('32 gb ram');

                if (activeKeywords.length > 0) {
                    processedData = processedData.filter(product => {
                        const title = product.title.toLowerCase();
                        const desc = product.desc.toLowerCase();
                        return activeKeywords.some(keyword =>
                            title.includes(keyword) || desc.includes(keyword)
                        );
                    });
                }
                if (filter.minprice && !isNaN(filter.minprice)) {
                    processedData = processedData.filter(product => Number(product.price) >= Number(filter.minprice));
                }
                if (filter.maxprice && !isNaN(filter.maxprice)) {
                    processedData = processedData.filter(product => Number(product.price) <= Number(filter.maxprice));
                }
                setProducts(processedData);

            } else {
                setProducts(res.data);
            }

        }).catch((e) => {
            setError(true)
        })
    }, [search, sort, filter])

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / productsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const searchresults = (input) => {
        setSearch(input);
    };

    const sortresults = (input) => {
        setSort(input);
    };

    const handlePageChange = (number) => {
        setCurrentPage(number);
    };
    return (
        <>
            <SearchBar type={"Laptop"} callback={searchresults} />
            <div className="showproducts">
                <div className="left">
                    <Sort callback={sortresults} />
                    <div className="filter">
                        <div className="filterbox">
                            <h3>Max Price</h3>
                            <input type="number" className='no-arrows' name="maxprice" id="maxprice" value={filter.maxprice ? filter.maxprice : ""} onChange={(e) => setFilter({ ...filter, maxprice: e.target.value })} />
                        </div>
                        <div className="filterbox">
                            <h3>Min Price</h3>
                            <input type="number" className='no-arrows' name="minprice" id="minprice" value={filter.minprice ? filter.minprice : ""} onChange={(e) => setFilter({ ...filter, minprice: e.target.value })} />
                        </div>
                        <div className="filterbox">
                            <h3>Processor</h3>
                            <h4>Amd <input type="checkbox" name="check" id="check" value={filter.amd} onChange={() => setFilter({ ...filter, amd: !filter.amd })} /></h4>
                            <h4>Intel <input type="checkbox" name="check" id="check" value={filter.intel} onChange={() => setFilter({ ...filter, intel: !filter.intel })} /></h4>
                        </div>
                        <div className="filterbox">
                            <h3>Ram</h3>
                            <h4>8 Gb <input type="checkbox" name="check" id="check" value={filter.eightram} onChange={() => setFilter({ ...filter, eightram: !filter.eightram })} /></h4>
                            <h4>16 Gb <input type="checkbox" name="check" id="check" value={filter.onesixram} onChange={() => setFilter({ ...filter, onesixram: !filter.onesixram })} /></h4>
                            <h4>24 Gb <input type="checkbox" name="check" id="check" value={filter.twofourram} onChange={() => setFilter({ ...filter, twofourram: !filter.twofourram })} /></h4>
                            <h4>32 Gb <input type="checkbox" name="check" id="check" value={filter.threetworam} onChange={() => setFilter({ ...filter, threetworam: !filter.threetworam })} /></h4>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="top">
                        {!error && currentProducts.map((product) => (
                            <Product
                                key={product.id}
                                id={product.id}
                                img={product.image}
                                title={product.title}
                                price={product.price}
                                desc={product.desc}
                                avgreview={product.avgreview}
                            />
                        ))}

                        {currentProducts.length === 0 && (
                            <h3 className='noproducts'>No Products , Try Another Products</h3>
                        )}
                    </div>
                    <div className="bottom">
                        {products.length > productsPerPage && (
                            <div className="pagination">
                                {pageNumbers.map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        className={currentPage === number ? 'active-page' : ''}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UsedPc