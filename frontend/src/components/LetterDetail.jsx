import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function LetterDetail() {
  const { id } = useParams();
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

  useEffect(() => {
    fetch(`http://localhost:5000/api/letters/${id}`)
      .then((res) => res.json())
      .then((data) => setLetter(data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
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

    fetch(`http://localhost:5000/api/letters/${id}/sign`, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage('Thank you for signing the letter!');
        setFormData({
          name: '',
          email: '',
          affiliation: '',
          note: '',
          socialLinks: '',
          file: null,
        });
        // Reload the letter details to include the new signature
        setLetter(data);
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred. Please try again.');
      });
  };

  if (!letter) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{letter.title}</h1>
      <p>{letter.content}</p>
      <h3>Signatures:</h3>
      <ul>
        {letter.signatures.map((signature, index) => (
          <li key={index}>
            <strong>{signature.name}</strong> ({signature.email}) - {signature.affiliation}<br />
            {signature.note && <em>Note: {signature.note}</em>}<br />
            {signature.socialLinks && <span>Social Links: {signature.socialLinks}</span>}<br />
            {signature.filePath && <span>Attachment: <a href={signature.filePath} target="_blank" rel="noopener noreferrer">View</a></span>}
          </li>
        ))}
      </ul>
      <h3>Sign the Letter:</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Affiliation:
            <input
              type="text"
              name="affiliation"
              value={formData.affiliation}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Note (optional):
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Social Links (optional):
            <input
              type="text"
              name="socialLinks"
              value={formData.socialLinks}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Attach Audio/Video (optional):
            <input type="file" name="file" onChange={handleFileChange} />
          </label>
        </div>
        <button type="submit">Sign</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LetterDetail;
