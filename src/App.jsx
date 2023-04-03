import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import FormData from 'form-data';

function App() {
  const [file, setFile] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setImgURL(null);
    setError(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      alert(error);
      return;
    }

    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', file, file.name);

    axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Api-Key': 'HXzCzRxrKTTtcMjtN8RKgf1k',
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          setError(`Request failed with status code ${response.status}`);
          alert('Failed to remove background. Please try again.');
          return;
        }

        const byteArray = new Uint8Array(response.data);
        const blob = new Blob([byteArray], { type: 'image/png' });
        setImgURL(URL.createObjectURL(blob));
      })
      .catch((error) => {
        setError(`Request failed with status code ${error.response.status}`);
        alert('Failed to remove background. Please try again.');
      });
  }

  function handleDownload() {
    const link = document.createElement('a');
    link.href = imgURL;
    link.download = file.name.replace(/\.[^/.]+$/, '') + '-bg-removed.png';
    link.click();
  }

  return (
    <div className="App">
      <h2>Background Remover</h2>
      <form id='form-container' onSubmit={handleSubmit}>
      <label htmlFor="input-tag">Upload Image
      <input type="file" className='custom-file-input' id='input-tag' onChange={handleFileChange} name="file" />
      </label>
        <button type="submit">Remove Background</button>
      </form>
      <div className='result-container'>
        {imgURL ? (
          <img className='result-image' src={imgURL} alt="background removed" />
        ) : (
          <p>Preview will be shown here.</p>
        )}

        {imgURL ? <button onClick={handleDownload}>Download Image</button> : null}
      </div>
    </div>
  );
}

export default App;