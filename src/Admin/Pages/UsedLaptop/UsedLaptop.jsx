import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Product from "../../Components/Product/Product";
import addproduct from "../../Assets/icons8-plus-48.png";
import { Link } from 'react-router-dom';
import {
  Chart as ChartJs,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import AlertContext from '../../../Context/AlertContext';


ChartJs.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

function UsedLaptop() {
  const [products, setProducts] = useState([]);
  const [doughnutData, setDoughnutData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [pop, setPop] = useState("")
  const [popid, setPopId] = useState("")
  const { setAlert, setAlertSt } = useContext(AlertContext)
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const callProducts = async () => {
    try {
      let data = await axios.get("http://localhost:5000/products?section=Laptop");
      const fetchedProducts = data.data;
      setProducts(fetchedProducts);

      // Prepare charts
      prepareDoughnutChart(fetchedProducts);
      prepareProductDateChart(fetchedProducts);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    callProducts();
  }, []);

  const prepareDoughnutChart = (products) => {
    const active = products.filter((p) => p.status === 'active').length;
    const nonActive = products.length - active;

    const data = {
      labels: ['Active', 'Non-active'],
      datasets: [
        {
          label: 'Product Status',
          data: [active, nonActive],
          backgroundColor: ['rgba(255, 193, 7, 0.7)', '#ddd'],
          borderColor: ['#fff', '#fff'],
          borderWidth: 1,
        },
      ],
    };

    setDoughnutData(data);
  };

  const prepareProductDateChart = (products) => {
    const dateCount = {};

    products.forEach((product) => {
      if (product.timestamp) {
        const date = new Date(product.timestamp);
        const label = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date.getFullYear()}`;

        dateCount[label] = (dateCount[label] || 0) + 1;
      }
    });

    const sortedLabels = Object.keys(dateCount).sort((a, b) => {
      const [aD, aM, aY] = a.split('-').map(Number);
      const [bD, bM, bY] = b.split('-').map(Number);
      return new Date(aY, aM - 1, aD) - new Date(bY, bM - 1, bD);
    });

    const chartData = {
      labels: sortedLabels,
      datasets: [
       {
          label: 'Products Added',
          data: sortedLabels.map((label) => dateCount[label]),
          borderColor: 'rgba(255, 193, 7, 0.7)',
          backgroundColor: 'rgba(255, 145, 0, 0.2)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    setLineChartData(chartData);
  };


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  const chartOptionscircle = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    }
  };

  const changeStatus = async (product) => {
    try {
      let status = product.status === 'active' ? 'non-active' : 'active';
      let data = { ...product, status: status };
      await axios.put(`http://localhost:5000/products/${product.id}`, data);
      callProducts();
      setAlert(`Product ${status === 'active' ? "Activated" : "Deactivated"}`);
      setAlertSt("success");
    } catch (e) {
      setAlert("Error Occured , Try Agian");
      setAlertSt("error");
      console.log(e);
    }
  }
  const removepop = (id) => {
    setPop("Are You Sure To Remove " + id)
    setPopId(id)
  }
  const remove = async (id) => {
    try {
      let data = await axios.delete(`http://localhost:5000/products/${popid}`)
      setAlert(`Product Removed`);
      setAlertSt("success");
      setPop("")
      setPopId("")
      callProducts()
    } catch (e) {
      console.log(e)
      setAlert(`Product Not Removed, Try Agian`);
      setAlertSt("error");
    }
  }
  return (
    <div className="usedpc">
      {
        pop &&
        <div className="pop">
          <div className="content">
            <h3>{pop}</h3>
            <div className="btns">
              <button className="cancel" onClick={() => { setPop(""); setPopId("") }}>Cancel</button>
              <button className='delete' onClick={remove}>Delete</button>
            </div>
          </div>
        </div>
      }
      <h1>Used Laptop</h1>

      <div style={{ display: 'flex', gap: '40px', margin: '30px 0', flexWrap:"wrap",justifyContent:"center" }}>

        <div style={{ width: '200px', height: '200px' }}>
          {doughnutData?.datasets && <Doughnut data={doughnutData} options={chartOptionscircle} />}
          <h3 style={{ textAlign: 'center' }}>{products.length} Products</h3>
        </div>


        <div style={{ width: '400px', height: '300px' }}>
          {lineChartData?.datasets && <Line data={lineChartData} options={chartOptions} />}
        </div>
      </div>

      <div className="search">
        <input
          type="search"
          placeholder="Search Here"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="non-active">Non-Active</option>
        </select>
      </div>
      <div className="content">
        {
          [...products].filter(product => {
            if (filter === "active") return product.status.toLowerCase() === "active";
            if (filter === "non-active") return product.status.toLowerCase() === "non-active";
            return true; // all
          })
            .filter(product => {
              const query = search.toLowerCase();
              return (
                product.title?.toLowerCase().includes(query) ||
                product.price?.toLowerCase().includes(query) ||
                product.desc?.toLowerCase().includes(query)
              );
            }).reverse().map((product) => (
              <Product
                key={product.id}
                id={product.id}
                img={product.image}
                title={product.title}
                price={product.price}
                status={product.status}
                avgreview={product.avgreview}
                change={() => changeStatus(product)}
                remove={removepop}
              />
            ))
        }
      </div>

      {/* Add Product Link */}
      <Link to={"/Admin/CreateProduct/Laptop"} className="addproduct">
        <img src={addproduct} alt="Add Product" />
      </Link>
    </div>
  );
}

export default UsedLaptop;
