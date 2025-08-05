import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import './style.css';
import axios from 'axios';
import heart from '../../Assets/icons8-heart-64.png';
import cart from '../../Assets/icons8-cart-64.png';
import order from '../../Assets/icons8-order-64.png';
import adduser from '../../Assets/icons8-add-user-male-48.png';
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

function Users() {
  const navigate = useNavigate()
  const [allUsers, setUsers] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [lineChartData, setLineChartData] = useState({});
  const { setAlert, setAlertSt } = useContext(AlertContext)
  useEffect(() => {
    callUsers();
  }, []);

  const callUsers = async () => {
    try {
      let data = await axios.get('http://localhost:5000/users?role=user');
      setUsers(data.data);
      getDoughnutData(data.data);
      prepareJoinDateChart(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getDoughnutData = (users) => {
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

  const prepareJoinDateChart = (users) => {
    const joinCount = {};

    users.forEach((user) => {
      if (user.joined_date) {
        const [day, month, year] = user.joined_date.split('-');
        const label = `${day}-${month}-${year}`;
        joinCount[label] = (joinCount[label] || 0) + 1;
      }
    });

    const sortedLabels = Object.keys(joinCount).sort((a, b) => {
      const [aMonth, aYear] = a.split('-').map(Number);
      const [bMonth, bYear] = b.split('-').map(Number);
      return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
    });

    const chartData = {
      labels: sortedLabels,
      datasets: [
        {
          label: 'Users Joined',
          data: sortedLabels.map((label) => joinCount[label]),
          borderColor: 'rgb(0, 157, 255)',
          backgroundColor: 'rgba(0, 157, 255, 0.2)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    setLineChartData(chartData);
  };

  const linechartOptions = {
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

  const userstatus = async (user) => {
    try {
      let status = user.status === 'active' ? 'non-active' : 'active';
      let data = { ...user, status: status };
      await axios.put(`http://localhost:5000/users/${user.id}`, data);
      callUsers();
      setAlert(`User ${status === 'active' ? "Activated" : "Deactivated"}`);
      setAlertSt("success");
    } catch (e) {
      setAlert("Error Occured , Try Agian");
      setAlertSt("error");
      console.log(e);
    }
  };

  const View = (id) => {
    navigate(`/Admin/Users/${id}`)
  }
  return (
    <div className="users">
      <h1>Users</h1>

      {/* Flex container for charts */}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
        {/* Doughnut Chart */}
        <div style={{ width: '200px', height: '200px' }}>
          {userdata?.datasets && <Doughnut data={userdata} options={circlechartOptions} />}
          <h3 style={{ textAlign: 'center' }}>{allUsers.length} Users</h3>
        </div>

        {/* Line Chart */}
        <div style={{ width: '400px', height: '300px' }}>
          {lineChartData?.datasets && <Line data={lineChartData} options={linechartOptions} />}
        </div>
      </div>

      {/* User list */}
      <div className="content">
        {[...allUsers].reverse().map((user, index) => (
          <div className="user" key={user._id || user.id}>
            <h4>{index + 1}</h4>
            <h4>{user.username}</h4>
            <h4>{user.email}</h4>
            <h4>
              {user.last_logined}
              <br />
              <pre>Last Logined</pre>
            </h4>
            <div className="det">
              <h4>
                <img src={cart} alt="" /> {user.cart?.length || 0}
              </h4>
              <h4>
                <img src={heart} alt="" /> {user.wishlist?.length || 0}
              </h4>
              <h4>
                <img src={order} alt="" className="invert" /> {user.orders?.length || 0}
              </h4>
            </div>
            <div className="buttons">
              <button onClick={() => userstatus(user)} className={user.status}>
                {user.status}
              </button>
              <button className="view" onClick={() => View(user.id)}>View</button>
            </div>
          </div>
        ))}
      </div>

      <Link to={"/Admin/CreateUser"} className="adduser">
        <img src={adduser} alt="" />
      </Link>
    </div>
  );
}

export default Users;
