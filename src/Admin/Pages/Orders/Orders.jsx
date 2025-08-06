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

  useEffect(() => {
    axios.get('http://localhost:5000/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      await axios.patch(`http://localhost:5000/orders/${orderId}`, {
        status: newStatus
      });

      console.log(`Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
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

  const renderOrders = (statusFilter) => (
    orders.filter(order => order.status === statusFilter).map(order => (
      <div key={order.id} className="order-card">
        <div className="div"><p><strong>ID:</strong> {order.id}</p>
          <p><strong>User:</strong> {order.user.name}</p>
          <p><strong>Email:</strong> {order.user.email}</p></div>
        <p><strong>Items:</strong><br></br>
          {order.items.map((item, i) => (
            <p key={i}>{item.title} <strong>⨉{item.quantity}</strong><br></br></p>
          ))}
        </p>
        <div className="div">
          <p><strong>Amount:</strong> ₹{order.amount}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
        <div>
          {order.status === 'Ordered' && (
            <button onClick={() => handleStatusChange(order.id, 'Dispatched')}>Mark as Dispatched</button>
          )}
          {order.status === 'Dispatched' && (
            <button onClick={() => handleStatusChange(order.id, 'Delivered')}>Mark as Delivered</button>
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

      <h2>Ordered</h2>
      {renderOrders('Ordered')}

      <h2>Dispatched</h2>
      {renderOrders('Dispatched')}

      <h2>Delivered</h2>
      {renderOrders('Delivered')}
    </div>
  );
}

export default OrderDashboard;
