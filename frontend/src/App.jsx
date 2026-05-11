import './App.css'
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AddResourceForm from './components/AddResourceForm';
import ResourceDetail from './pages/ResourceDetail';
import CreateVaultModal from './components/CreateVault';
import VaultDetail from './pages/VaultDetail';
import { Routes, Route, useNavigate } from 'react-router';
import Login from "./pages/Login";
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import InviteMemberForm from './components/InviteMemberForm';
import AcceptInvitePage from './pages/AcceptInvitePage';
import { createVault } from './api/vault.api';

function CreateVaultRoute() {
  const navigate = useNavigate();

  const handleCreateVault = async (data) => {
    await createVault(data);
    navigate('/dashboard');
  };

  return (
    <CreateVaultModal
      onClose={() => navigate('/dashboard')}
      onCreate={handleCreateVault}
    />
  );
}

function App() {
  return (

    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route 
        path='/dashboard' 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path='/vaults/:vaultId'
        element={
          <ProtectedRoute>
            <VaultDetail />
          </ProtectedRoute>
        }/>
      <Route 
        path='/create-vault' 
        element={
          <ProtectedRoute>
            <CreateVaultRoute />
          </ProtectedRoute>
        }/>
      <Route 
        path='/add-resource' 
        element={
          <ProtectedRoute>
            <AddResourceForm />
          </ProtectedRoute>
        }/>
      {/* <Route
        path='/vault/:vaultId'
        element={
          <ProtectedRoute>
            <VaultDetail />
          </ProtectedRoute>
        }
      /> */}
      <Route 
        path='/resource/:resourceId' 
        element={
          <ProtectedRoute>
            <ResourceDetail />
          </ProtectedRoute>
        }/>

        <Route 
          path='/accept-invite/:token'
          element={<AcceptInvitePage />}
        />
      
    </Routes>

  )
}

export default App;
