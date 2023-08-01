import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [promises, setPromises] = useState([]);
  const [newPromise, setNewPromise] = useState('');
  const [recUsername, setRecUsername] = useState('');  // New state for receiver username
  const currentUser = localStorage.getItem('username');  // Fetch username from local storage

  useEffect(() => {
    fetchPromises();
  }, []);

  const fetchPromises = async () => {
    try {
      const config = {
        withCredentials: true  // This will include cookies in requests
      };
      const response = await axios.get('https://promisestatbackend.azurewebsites.net/api/get-promises', config);
      setPromises(response.data);
    } catch (error) {
      console.error('Error fetching promises:', error.response.data.error);
    }
  };

  const handleAddPromise = async () => {
    if (newPromise.trim() !== '' && recUsername.trim() !== '') {
      try {
        await axios.post('https://promisestatbackend.azurewebsites.net/api/add-promise', {
          promise: newPromise,
          recusername: recUsername, // Use receiver username from state
          senusername: currentUser, // Use the username from local storage
          sentAt: new Date(),
        });
        fetchPromises();
        setNewPromise('');
        setRecUsername('');  // Clear the input field
      } catch (error) {
        console.error('Error adding promise:', error.response.data.error);
      }
    }
  };

  const handlePromiseStatusChange = async (index, status) => {
    try {
      await axios.put(`https://promisestatbackend.azurewebsites.net/api/update-promise/${promises[index].id}`, { status });
      fetchPromises();
    } catch (error) {
      console.error('Error updating promise status:', error.response.data.error);
    }
  };

  const calculatePromiseWeightScore = () => {
    const keptPromisesCount = promises.filter((promise) => promise.status === 'kept').length;
    const totalKeptOrFailedPromisesCount = keptPromisesCount + promises.filter((promise) => promise.status === 'failed').length;

    if (totalKeptOrFailedPromisesCount === 0) {
      return 0;
    }

    return ((keptPromisesCount / totalKeptOrFailedPromisesCount) * 100).toFixed(2);
  };

  const promiseWeightScore = calculatePromiseWeightScore();

  const renderPromise = (promise, index, status) => (
    <li key={index}>
      {promise.promise} <br />
      Sent by: {promise.senusername} <br />
      Received by: {promise.recusername} <br />
      Sent at: {new Date(promise.sentAt).toLocaleString()}
      {status === 'active' && (
        <div>
          <button onClick={() => handlePromiseStatusChange(index, 'kept')}>Promise Kept</button>
          <button onClick={() => handlePromiseStatusChange(index, 'failed')}>Promise Failed</button>
        </div>
      )}
    </li>
  );

  return (
    <div>
      <h1>My Promises</h1>
      <div>
        <input
          type="text"
          value={newPromise}
          onChange={(e) => setNewPromise(e.target.value)}
          placeholder="Enter your promise..."
        />
        <input
          type="text"
          value={recUsername}
          onChange={(e) => setRecUsername(e.target.value)}
          placeholder="Enter receiver username..."
        />
        <button onClick={handleAddPromise}>Add Promise</button>
      </div>
      <h2>Active Promises:</h2>
      <ul>
        {promises.map((promise, index) => promise.status === 'active' && renderPromise(promise, index, 'active'))}
      </ul>
      <h2>Recieved Promises:</h2>
      <ul>
        {promises.map((promise, index) => promise.recusername === currentUser && (promise.status === 'kept' || promise.status === 'failed') && renderPromise(promise, index, promise.status))}
      </ul>
      <h2>Kept Promises:</h2>
      <ul>
        {promises.map((promise, index) => promise.status === 'kept' && renderPromise(promise, index, 'kept'))}
      </ul>
      <h2>Failed Promises:</h2>
      <ul>
        {promises.map((promise, index) => promise.status === 'failed' && renderPromise(promise, index, 'failed'))}
      </ul>
      <div>
        <h2>Promise Weight Score: {promiseWeightScore}%</h2>
      </div>
    </div>
  );
};

export default Dashboard;
