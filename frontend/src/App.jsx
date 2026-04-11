import { useState } from 'react'
import './App.css'
import Button from './components/Button'

function App() {
  return (
    <div className='m-10'>
      <Button variant='gray' children={"Sign In"}/>
    </div>
  )
}

export default App
