import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './style.css';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [searchOrders, setSearchOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:5000/orders')
      .then(res => {
        setOrders(res.data);
        setSearchOrders(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    let filtered = [...orders];
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === filter);
    }
    setSearchOrders(filtered);
  }, [filter, orders]);
  useEffect(()=>{
    searchOrder()
  },[search])
  const handleStatusChange = async (orderId, newStatus, orderd) => {
    try {
 
      const res = await axios.patch(
        `http://localhost:5000/orders/${orderId}`,
        { status: newStatus },
        { headers: { 'Content-Type': 'application/json' } }
      );


      const userId = orderd.user.id;
      const userRes = await axios.get(`http://localhost:5000/users/${userId}`);
      const userData = userRes.data;

      const updatedUserOrders = userData.orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      await axios.put(`http://localhost:5000/users/${userId}`, {
        ...userData,
        orders: updatedUserOrders
      });


      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
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
      return new Date(2025, aM - 1, aD) - new Date(2025, bM - 1, bD);
    });

    return {
      labels: sortedLabels,
      datasets: [{
        label: 'Orders per Day',
        data: sortedLabels.map(date => countByDate[date]),
        fill: true,
        backgroundColor: 'rgba(0,157,255,0.2)',
        borderColor: 'rgb(0,157,255)',
        tension: 0.4,
      }],
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
      datasets: [{
        label: 'Profit by Month',
        data: sortedLabels.map(label => profitByMonth[label]),
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgb(75,192,192)',
        tension: 0.4,
      }],
    };
  };

  const renderOrders = (statusFilter) => (
    searchOrders
      .filter(order => order.status.toLowerCase() === statusFilter.toLowerCase())
      .map(order => (
        <div key={order.id} className="order-card">
          <div className="div">
            <p><strong>ID:</strong> {order.id}</p>
            <p><strong>User:</strong> {order.user.id}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
          </div>
          <div><strong>Items:</strong><br />
            {order.items.map((item, i) => (
              <p key={i}>{item.title} <strong>×{item.quantity}</strong></p> 
            ))}
          </div>
          <div className="div">
            <p><strong>Amount:</strong> ₹{order.amount}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
          <div>
            {order.status.toLowerCase() === 'ordered' && (
              <button onClick={() => handleStatusChange(order.id, 'Dispatched', order)}>
                Mark as Dispatched
              </button>
            )}
            {order.status.toLowerCase() === 'dispatched' && (
              <button onClick={() => handleStatusChange(order.id, 'Delivered', order)}>
                Mark as Delivered
              </button>
            )}
          </div>
        </div>
      ))
  );

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#333',
          font: { size: 14, weight: 'bold' },
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
        grid: { color: '#eee', borderDash: [4, 4] },
        ticks: { color: '#555', font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f0f0f0' },
        ticks: { color: '#555', font: { size: 12 } },
      },
    },
  };

  const searchOrder = () => {
    let filtered = [...orders];

    if (filter !== "all") {
      filtered = filtered.filter(order => order.status.toLowerCase() === filter);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toString().includes(lowerSearch) ||
        order.user.email.toLowerCase().includes(lowerSearch) ||
        order.user.id.toString().includes(lowerSearch) ||
        order.items.some(item => item.title.toLowerCase().includes(lowerSearch))
      );
    }

    setSearchOrders(filtered);
  };

  return ( 
    <div className="Order">
      <h1>Order Dashboard</h1>

      <div className="charts">
        <div className="chart">
          <Line data={getDateLineChart()} options={lineChartOptions} />
        </div>
        <div className="chart">
          <Line data={getProfitLineChart()} options={lineChartOptions} />
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
          <option value="ordered">Ordered</option>
          <option value="dispatched">Dispatched</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {filter === 'all' ? (
        <>
          <h2>Ordered</h2>
          {renderOrders('Ordered')}
          <h2>Dispatched</h2>
          {renderOrders('Dispatched')}
          <h2>Delivered</h2>
          {renderOrders('Delivered')}
        </>
      ) : (
        <>
          <h2>{filter.charAt(0).toUpperCase() + filter.slice(1)}</h2>
          {renderOrders(filter)}
        </>
      )}
    </div>
  );
}

export default OrderDashboard;
