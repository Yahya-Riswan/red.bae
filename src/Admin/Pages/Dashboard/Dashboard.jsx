import React, { useState, useEffect } from 'react'
import "./style.css"
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';



ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);
function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [orderdata, setOrderData] = useState([]);
  const [productdata, setProductData] = useState([]);
  const [products, setProducts] = useState(0);
  const [users, setUsers] = useState(0);
  useEffect(() => {
    axios.get('http://localhost:5000/orders')
      .then(res => {
        setOrders(res.data);
        OgetDoughnutData(res.data)
      })
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => {
        setProducts(res.data);
        PgetDoughnutData(res.data)
      })
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    callUsers();
  }, []);

  const callUsers = async () => {
    try {
      let data = await axios.get('http://localhost:5000/users?role=user');
      UgetDoughnutData(data.data);
      setUsers([...data.data].length)
    } catch (e) {
      console.log(e);
    }
  };
  const UgetDoughnutData = (users) => {
    const active = users.filter((u) => u.status === 'active').length;
    const nonActive = users.length - active;

    const data = {
      labels: ['Active', 'Non-active'],
      datasets: [
        {
          label: 'User Status',
          data: [active, nonActive],
          backgroundColor: ['rgb(0, 157, 255)', '#ddd'],
          borderColor: ['#fff', '#fff'],
          borderWidth: 1,
        },
      ],
    };
    setUserData(data);
  };
  const PgetDoughnutData = (products) => {
    const Pc = products.filter((o) => o.section === 'Pc').length;
    const Laptop = products.filter((o) => o.section === 'Laptop').length;
    const PcParts = products.filter((o) => o.section === 'PcParts').length;

    const data = {
      labels: ['Pc', 'Laptop', 'PcPart'],
      datasets: [
        {
          label: 'Product Status',
          data: [Pc, Laptop, PcParts],
          backgroundColor: [
            'rgba(0, 157, 255, 0.7)',     // blue
            'rgba(255, 193, 7, 0.7)',     // yellow
            'rgba(40, 167, 69, 0.7)'      // green
          ],
          borderColor: ['#fff', '#fff', '#fff'],
          borderWidth: 2,
        },
      ],
    };

    setProductData(data);
  };
  const OgetDoughnutData = (orders) => {
    const ordered = orders.filter((o) => o.status === 'Ordered').length;
    const dispatched = orders.filter((o) => o.status === 'Dispatched').length;
    const delivered = orders.filter((o) => o.status === 'Delivered').length;

    const data = {
      labels: ['Ordered', 'Dispatched', 'Delivered'],
      datasets: [
        {
          label: 'Order Status',
          data: [ordered, dispatched, delivered],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',   // Blue
            'rgba(255, 99, 132, 0.7)',   // Red
            'rgba(255, 206, 86, 0.7)'    // Yellow
          ],
          borderColor: ['#fff', '#fff', '#fff'],
          borderWidth: 2,
        },
      ],
    };

    setOrderData(data);
  };

  const getDateLineChart = () => {
    const countByDate = {};
    orders.forEach(order => {
      const date = new Date(order.timestamp);
      const label = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
        .toString().padStart(2, '0')}`;
      countByDate[label] = (countByDate[label] || 0) + 1;
    });

    const sortedLabels = Object.keys(countByDate).sort((a, b) => {
      const [aD, aM] = a.split('-').map(Number);
      const [bD, bM] = b.split('-').map(Number);
      return new Date(2025, aM - 1, aD) - new Date(2025, bM - 1, bD); // Use dummy year
    });

    return {
      labels: sortedLabels,
      datasets: [
        {
          label: 'Orders per Day',
          data: sortedLabels.map(date => countByDate[date]),
          fill: true,
          backgroundColor: 'rgba(0,157,255,0.2)',
          borderColor: 'rgb(0,157,255)',
          tension: 0.4,
        },
      ],
    };
  };

  const getProfitLineChart = () => {
    const profitByMonth = {};
    orders.forEach(order => {
      const date = new Date(order.timestamp);
      const label = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
      profitByMonth[label] = (profitByMonth[label] || 0) + order.amount;
    });

    const sortedLabels = Object.keys(profitByMonth).sort((a, b) => {
      const [aM, aY] = a.split('-').map(Number);
      const [bM, bY] = b.split('-').map(Number);
      return new Date(aY, aM - 1) - new Date(bY, bM - 1);
    });

    return {
      labels: sortedLabels,
      datasets: [
        {
          label: 'Profit by Month',
          data: sortedLabels.map(label => profitByMonth[label]),
          fill: true,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgb(75,192,192)',
          tension: 0.4,
        },
      ],
    };
  };
  const circlechartOptions = {
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
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#eee',
        cornerRadius: 6,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#eee',
          borderDash: [4, 4],
        },
        ticks: {
          color: '#555',
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          color: '#555',
          font: {
            size: 12,
          },
        },
      },
    },
  };
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="charts">
        <div className="chart">
          <Line data={getDateLineChart()} options={lineChartOptions} />
        </div>
        <div className="chart">
          <Line data={getProfitLineChart()} options={lineChartOptions} />
        </div>
      </div>
      <div className="charts">
        <div className="chartsm">
          {userdata?.datasets && <Doughnut data={userdata} options={circlechartOptions} />}
          <h2>{users} Users</h2>
        </div>
        <div className="chartsm">
          {orderdata?.datasets && <Doughnut data={orderdata} options={circlechartOptions} />}
          <h2>{orders.length} Orders</h2>
        </div>
        <div className="chartsm">
          {productdata?.datasets && <Doughnut data={productdata} options={circlechartOptions} />}
          <h2>{products.length} Products</h2>
        </div>
      </div>
    </div>
  )
}

export default Dashboard