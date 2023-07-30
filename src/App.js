import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'promisestatserver.database.windows.net';

const App = () => {
  const [promises, setPromises] = useState([]);
  const [newPromise, setNewPromise] = useState('');

  useEffect(() => {
    fetchPromises();
  }, []);

  const fetchPromises = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/get-promises`);
      setPromises(response.data);
    } catch (error) {
      console.error('Error fetching promises:', error.response.data.error);
    }
  };

  const handleAddPromise = async () => {
    if (newPromise.trim() !== '') {
      try {
        await axios.post(`${BASE_URL}/api/add-promise`, { text: newPromise });
        fetchPromises();
        setNewPromise('');
      } catch (error) {
        console.error('Error adding promise:', error.response.data.error);
      }
    }
  };

  const handlePromiseStatusChange = async (index, status) => {
    try {
      await axios.put(`${BASE_URL}/api/update-promise/${promises[index].id}`, { status });
      setPromises((prevState) => {
        const updatedPromises = [...prevState];
        updatedPromises[index].status = status;
        return updatedPromises;
      });
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

  return (
    <div>
      <a href="/.auth/login/aad">Login</a>
      <h1>My Promises</h1>
      <div>
        <input
          type="text"
          value={newPromise}
          onChange={(e) => setNewPromise(e.target.value)}
          placeholder="Enter your promise..."
        />
        <button onClick={handleAddPromise}>Add promise</button>
      </div>
      <div>
        <h2>Active Promises</h2>
        <ul>
          {promises.map((promise, index) => (
            promise.status === 'active' && (
              <li key={index}>
                {promise.text}
                <div>
                  <button onClick={() => handlePromiseStatusChange(index, 'kept')}>Promise Kept</button>
                  <button onClick={() => handlePromiseStatusChange(index, 'failed')}>Promise Failed</button>
                </div>
              </li>
            )
          ))}
        </ul>
      </div>
      <div>
        <h2>Promises Kept</h2>
        <ul>
          {promises.map((promise, index) => (
            promise.status === 'kept' && (
              <li key={index}>{promise.text}</li>
            )
          ))}
        </ul>
      </div>
      <div>
        <h2>Promises Failed</h2>
        <ul>
          {promises.map((promise, index) => (
            promise.status === 'failed' && (
              <li key={index}>{promise.text}</li>
            )
          ))}
        </ul>
      </div>
      <div>
        <h2>Promise Weight Score: {promiseWeightScore}%</h2>
      </div>
    </div>
  );
};

export default App;
