import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Customizer from './pages/Customizer';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/customizer" />} />
        <Route path="/customizer" element={<Customizer />} />
      </Routes>
    </HashRouter>
  )
}

export default App;
