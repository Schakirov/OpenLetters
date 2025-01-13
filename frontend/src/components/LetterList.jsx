import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function LetterList() {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/letters')
      .then((res) => res.json())
      .then((data) => setLetters(data));
  }, []);

  return (
    <div>
      <h1>Open Letters</h1>
      <ul>
        {letters.map((letter) => (
          <li key={letter.id}>
            <h2>{letter.title}</h2>
            <p>{letter.summary}</p>
            <Link to={`/letters/${letter.id}`}>Read More</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LetterList;
