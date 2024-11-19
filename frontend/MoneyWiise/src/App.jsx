import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/Register',
    element: <Register/>
  },
  {
    path: '/Dashboard',
    element: <Dashboard/>
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
