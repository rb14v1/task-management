import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';

function Healthz() {
  return <pre style={{ fontFamily: 'monospace' }}>{'{"status":"ok"}'}</pre>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/task/:id" element={<TaskDetail />} />
        <Route path="/healthz" element={<Healthz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;