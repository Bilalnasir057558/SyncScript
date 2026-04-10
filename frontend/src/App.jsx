import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Input from './components/Input'

function App() {
  const [name, setName] = useState("")

  return (
    <div>
      <Input 
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="E.g. Dr. Julian Vane"
      />
    </div>
  )
}

export default App
