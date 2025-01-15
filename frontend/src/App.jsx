import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LetterList from './components/LetterList';
import LetterDetail from './components/LetterDetail';

function App() {
  const basename = import.meta.env.MODE === 'production' ? '/openletters' : '/';
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<LetterList />} />
        <Route path="/letters/:id" element={<LetterDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
