import './App.css'
import FeaturesSection from './components/FeaturesSection'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Login from './pages/Login'

function App() {
  return (
    // <HeroSection />
    // <FeaturesSection />
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* 2. Add padding top (pt-24) so the Login form 
          doesn't hide under the fixed Navbar */}
      <main className="pt-24">
        <Login />
      </main>
    </div>
  )
}

export default App;
