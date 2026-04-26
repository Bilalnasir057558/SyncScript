import './App.css'
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AddResourceForm from './components/AddResourceForm';
import ResourceDetail from './pages/ResourceDetail';
import CreateVaultModal from './components/CreateVault';
import { Routes, Route } from 'react-router';
import Login from "./pages/Login";
import Register from './pages/Register';

function App() {
  return (

    // all basic routes are added
    // TODO: implement guest routes and protected routes later
    // TODO: implement nested routes if any in future
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path='/create-vault' element={<CreateVaultModal />} />
      <Route path='/add-resource' element={<AddResourceForm />} />
      <Route path='/annotation' element={<ResourceDetail />} />
      
    </Routes>

  )
}

export default App;
