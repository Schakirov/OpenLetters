import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function LetterDetail() {
  const { id } = useParams();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [letter, setLetter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    affiliation: '',
    note: '',
    socialLinks: '',
    file: null,
  });
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/letters/${id}`)
      .then((res) => res.json())
      .then((data) => setLetter(data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 100 * 1024 * 1024) {
      setMessage('File size must be less than 100 MB.');
    } else {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('affiliation', formData.affiliation);
    data.append('note', formData.note);
    data.append('socialLinks', formData.socialLinks);
    if (formData.file) {
      data.append('file', formData.file);
    }

    fetch(`${apiBaseUrl}/letters/${id}/sign`, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage('Thank you for signing the letter! Your signature will appear after approval.');
        setFormData({
          name: '',
          email: '',
          affiliation: '',
          note: '',
          socialLinks: '',
          file: null,
        });
        // Reload the letter details to include the new signature
        setLetter((prevLetter) => ({
          ...prevLetter,
          signatures: [...prevLetter.signatures, { ...data, verified: 0 }],
        }));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred. Please try again.');
      });
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        setIsRecording(true);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          if (blob.size > 0) {
            if (blob.size > 100 * 1024 * 1024) {
              setMessage('Recorded video exceeds 100 MB. Please record a shorter video.');
              setRecordedChunks([]);
            } else {
              const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
              setFormData({ ...formData, file });
            }
          } else {
            setMessage('Recording failed or was empty.');
          }
          setIsRecording(false);
        };
        

        recorder.start();
      })
      .catch((error) => console.error('Error accessing media devices:', error));
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    // Stop all tracks from the stream
    if (mediaRecorder.stream) {
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  if (!letter) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '20vw' }}></div>
      <div style={{ width: '60vw' }} >
        <h1>{letter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: letter.content }} />
        <br/>
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign the Letter:</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label>Affiliation:</label>
              <input
                type="text"
                name="affiliation"
                value={formData.affiliation}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label>Note (optional):</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px' }}
              />
            </div>
            <div>
              <label>Link to your support of the Open Letter on social networks (optional, separated by commas if multiple):</label>
              <input
                type="text"
                name="socialLinks"
                value={formData.socialLinks}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label>Attach a video statement of your support (optional; you can record it, for example, on <a href="https://webcamera.io/">https://webcamera.io/</a>):</label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                style={{ padding: '8px' }}
              />
            </div>
            {/*<div>
              <label>Or record a video statement (max 5 minutes):</label>
              {isRecording ? (
                <button type="button" onClick={stopRecording} style={{ padding: '10px', borderRadius: '5px', background: 'red', color: '#fff', border: 'none', cursor: 'pointer' }}>Stop Recording</button>
              ) : (
                <button type="button" onClick={startRecording} style={{ padding: '10px', borderRadius: '5px', background: 'green', color: '#fff', border: 'none', cursor: 'pointer' }}>Start Recording</button>
              )}
            </div>*/}
            <button
              type="submit"
              style={{ padding: '10px', borderRadius: '5px', background: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Sign
            </button>
          </form>
          {message && <p style={{ textAlign: 'center', marginTop: '10px', color: 'green' }}>{message}</p>}
        </div>
        <h3>Signatures:</h3>
        <ul>
          {letter.signatures.filter(signature => signature.verified).map((signature, index) => (
            <li key={index}>
              <strong>{signature.name}</strong> - {signature.affiliation}<br />
              {/*{signature.note && <em>Note: {signature.note}</em>}<br />
              {signature.socialLinks && <span>Social Links: {signature.socialLinks}</span>}<br />
              {signature.filePath && <span>Attachment: <a href={signature.filePath} target="_blank" rel="noopener noreferrer">View</a></span>}*/}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LetterDetail;
