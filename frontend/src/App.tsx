import React, { useState } from 'react'
import Visualizer from './components/Visualizer'

export default function App() {
  const [sample] = useState('a^n b^n')
  return (
    <div className="app">
      <h1>Pumping Lemma Visualizer</h1>
      <p>Sample language: {sample}</p>
      <Visualizer />
    </div>
  )
}
