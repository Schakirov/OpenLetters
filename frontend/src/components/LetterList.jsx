import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function LetterList() {
  const [letters, setLetters] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetch(`${apiBaseUrl}/letters`)
      .then((res) => res.json())
      .then((data) => setLetters(data));
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Open Letters</h1>
        <p style={styles.subtitle}>
          Browse and support letters advocating for critical causes worldwide.
        </p>
      </header>
      <div style={styles.grid}>
        {letters.map((letter) => (
          <div key={letter.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>{letter.title}</h2>
              <p style={styles.cardSummary}>{letter.summary}</p>
            </div>
            <Link to={`/letters/${letter.id}`} style={styles.readMoreButton}>
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100vw', 
    padding: '0px',
    fontFamily: '"Arial", sans-serif',
    backgroundColor: '#f9f9f9',
    color: '#333',
    minHeight: '100vh', // Ensures it takes the full height of the screen
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#555',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '1200px', // Limits the width of the content
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHeader: {
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
  },
  cardSummary: {
    fontSize: '1rem',
    color: '#666',
    margin: '0',
  },
  readMoreButton: {
    marginTop: '10px',
    textAlign: 'center',
    display: 'inline-block',
    padding: '10px 20px',
    color: '#fff',
    backgroundColor: '#007BFF',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
};

export default LetterList;
