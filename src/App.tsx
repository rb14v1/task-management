import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function Healthz() {
  return <pre style={{ fontFamily: 'monospace' }}>{'{"status":"ok"}'}</pre>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/:id"
            element={
              <ProtectedRoute>
                <TaskDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/healthz" element={<Healthz />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
