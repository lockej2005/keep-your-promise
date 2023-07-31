import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [promises, setPromises] = useState([]);
  const [newPromise, setNewPromise] = useState('');

  useEffect(() => {
    fetchPromises();
  }, []);

  const fetchPromises = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get-promises');
      setPromises(response.data);
    } catch (error) {
      console.error('Error fetching promises:', error.response.data.error);
    }
  };

  const handleAddPromise = async () => {
    if (newPromise.trim() !== '') {
      try {
        await axios.post('http://localhost:5000/api/add-promise', {
          promise: newPromise,
          recusername: 'recuser', // Replace with actual value
          senusername: 'senuser', // Replace with actual value
          sentAt: new Date(),
        });
        fetchPromises();
        setNewPromise('');
      } catch (error) {
        console.error('Error adding promise:', error.response.data.error);
      }
    }
  };

  const handlePromiseStatusChange = async (index, status) => {
    try {
      await axios.put(`http://localhost:5000/api/update-promise/${promises[index].id}`, { status });
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
        <button onClick={handleAddPromise}>Add Promise</button>
      </div>
      <h2>Active Promises:</h2>
      <ul>
        {promises.map((promise, index) => promise.status === 'active' && renderPromise(promise, index, 'active'))}
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
