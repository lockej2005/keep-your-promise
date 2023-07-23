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
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching promises:', error.response.data.error);
    }
  };
  
  const handleAddPromise = async () => {
    if (newPromise.trim() !== '') {
      try {
        // Send a POST request to the API endpoint to add the new promise
        await axios.post('http://localhost:5000/api/add-promise', { text: newPromise });
        // If the request is successful, fetch updated promises from the API
        fetchPromises();
        setNewPromise('');
      } catch (error) {
        console.error('Error adding promise:', error.response.data.error);
      }
    }
  };

  const handlePromiseStatusChange = async (index, status) => {
    const updatedPromises = [...promises];
    updatedPromises[index].status = status;
    setPromises(updatedPromises);

    try {
      // Send a PUT request to the API endpoint to update the promise status
      await axios.put(`http://localhost:5000/api/update-promise/${promises[index].id}`, { status });
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

  const activePromises = promises.filter((promise) => promise.status === 'active');
  const promisesKept = promises.filter((promise) => promise.status === 'kept');
  const promisesFailed = promises.filter((promise) => promise.status === 'failed');
  const promiseWeightScore = calculatePromiseWeightScore();

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
      <div>
        <h2>Active Promises</h2>
        <ul>
          {activePromises.map((promise, index) => (
            <li key={index}>
              {promise.text}
              <div>
                <button onClick={() => handlePromiseStatusChange(index, 'kept')}>Promise Kept</button>
                <button onClick={() => handlePromiseStatusChange(index, 'failed')}>Promise Failed</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Promises Kept</h2>
        <ul>
          {promisesKept.map((promise, index) => (
            <li key={index}>{promise.text}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Promises Failed</h2>
        <ul>
          {promisesFailed.map((promise, index) => (
            <li key={index}>{promise.text}</li>
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
