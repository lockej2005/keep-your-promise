import React, { useState } from 'react';

const App = () => {
  const [promises, setPromises] = useState([]);
  const [newPromise, setNewPromise] = useState('');

  const handleAddPromise = () => {
    if (newPromise.trim() !== '') {
      setPromises([...promises, { text: newPromise, status: 'active' }]);
      setNewPromise('');
    }
  };

  const handlePromiseStatusChange = (index, status) => {
    const updatedPromises = [...promises];
    updatedPromises[index].status = status;
    setPromises(updatedPromises);
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
