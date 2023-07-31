import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [promises, setPromises] = useState([]);
  const [newPromise, setNewPromise] = useState('');

  useEffect(() => {
    // Fetch promises from the API when the component mounts
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
        // Send a POST request to the API endpoint to add the new promise
        await axios.post('http://localhost:5000/api/add-promise', { promise: newPromise });
        // If the request is successful, fetch updated promises from the API
        fetchPromises();
        setNewPromise('');
      } catch (error) {
        console.error('Error adding promise:', error.response.data.error);
      }
    }
  };

  const handlePromiseStatusChange = async (index, status) => {
    try {
      // Send a PUT request to the API endpoint to update the promise status
      await axios.put(`http://localhost:5000/api/update-promise/${promises[index].id}`, { status });

      // Update the promises state using the functional form of setPromises
      setPromises((prevState) => {
        const updatedPromises = [...prevState];
        updatedPromises[index].status = status;

        // Update activePromises, promisesKept, and promisesFailed with the updated promise
        // No need to update activePromises, promisesKept, and promisesFailed here
        // as they are now part of the promises state

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

  // No need to filter activePromises, promisesKept, and promisesFailed here
  // as they are now part of the promises state

  const promiseWeightScore = calculatePromiseWeightScore();

  return (
    <div>
      <h1>My Promises</h1>
      <div>
        <input
          type="promise"
          value={newPromise}
          onChange={(e) => setNewPromise(e.target.value)}
          placeholder="Enter your promise..."
        />
        <button onClick={handleAddPromise}>Add Promise</button>
      </div>
      <div>
        <h2>Active Promises</h2>
        <ul>
          {promises.map((promise, index) => (
            promise.status === 'active' && (
              <li key={index}>
                {promise.promise}
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
              <li key={index}>{promise.promise}</li>
            )
          ))}
        </ul>
      </div>
      <div>
        <h2>Promises Failed</h2>
        <ul>
          {promises.map((promise, index) => (
            promise.status === 'failed' && (
              <li key={index}>{promise.promise}</li>
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