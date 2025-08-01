import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../../Components/Product/Product';
import SearchBar from '../../Components/SearchBar/SearchBar';
import Sort from '../../Components/Sort/Sort';


function UsedPc() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(false);
    const [sort, setSort] = useState("none");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    useEffect(() => {
        axios.get("http://localhost:5000/products?section=Pc").then((res) => {
            let data = res.data;

            // Search
            if (search) {
                data = data.filter(product =>
                    product.title.toLowerCase().includes(search.toLowerCase())
                );
            }

            // Sort
            if (sort) {
                if (sort === 'price_high_low') {
                    data = data.sort((a, b) => b.price - a.price);
                } else if (sort === 'price_low_high') {
                    data = data.sort((a, b) => a.price - b.price);
                } else if (sort === "newest") {
                    data = data.sort((a, b) => b.timestamp - a.timestamp);
                }
            }

            // Filter
            if (filter) {
                let processedData = data;

                const activeKeywords = [];
                if (filter.amd) activeKeywords.push('amd');
                if (filter.intel) activeKeywords.push('intel');
                if (filter.eightram) activeKeywords.push('8gb dd');
                if (filter.onesixram) activeKeywords.push('16gb dd');
                if (filter.twofourram) activeKeywords.push('24gb dd');
                if (filter.threetworam) activeKeywords.push('32gb dd');

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
                    processedData = processedData.filter(product =>
                        Number(product.price) >= Number(filter.minprice)
                    );
                }

                if (filter.maxprice && !isNaN(filter.maxprice)) {
                    processedData = processedData.filter(product =>
                        Number(product.price) <= Number(filter.maxprice)
                    );
                }

                setProducts(processedData);
            } else {
                setProducts(data);
            }

            setCurrentPage(1); 
        }).catch((e) => {
            setError(true);
        });
    }, [search, sort, filter]);

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
            <SearchBar type={"Pc"} callback={searchresults} />
            <div className="showproducts">
                <div className="left">
                    <Sort callback={sortresults} />
                    <div className="filter">
                        <div className="filterbox">
                            <h3>Max Price</h3>
                            <input type="number" className='no-arrows' name="maxprice" id="maxprice" value={filter.maxprice || ""} onChange={(e) => setFilter({ ...filter, maxprice: e.target.value })} />
                        </div>
                        <div className="filterbox">
                            <h3>Min Price</h3>
                            <input type="number" className='no-arrows' name="minprice" id="minprice" value={filter.minprice || ""} onChange={(e) => setFilter({ ...filter, minprice: e.target.value })} />
                        </div>
                        <div className="filterbox">
                            <h3>Processor</h3>
                            <h4>Amd <input type="checkbox" checked={filter.amd || false} onChange={() => setFilter({ ...filter, amd: !filter.amd })} /></h4>
                            <h4>Intel <input type="checkbox" checked={filter.intel || false} onChange={() => setFilter({ ...filter, intel: !filter.intel })} /></h4>
                        </div>
                        <div className="filterbox">
                            <h3>Ram</h3>
                            <h4>8 Gb <input type="checkbox" checked={filter.eightram || false} onChange={() => setFilter({ ...filter, eightram: !filter.eightram })} /></h4>
                            <h4>16 Gb <input type="checkbox" checked={filter.onesixram || false} onChange={() => setFilter({ ...filter, onesixram: !filter.onesixram })} /></h4>
                            <h4>24 Gb <input type="checkbox" checked={filter.twofourram || false} onChange={() => setFilter({ ...filter, twofourram: !filter.twofourram })} /></h4>
                            <h4>32 Gb <input type="checkbox" checked={filter.threetworam || false} onChange={() => setFilter({ ...filter, threetworam: !filter.threetworam })} /></h4>
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
    );
}

export default UsedPc;
