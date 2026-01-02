import React from 'react';
import { Toaster } from 'react-hot-toast';
import Weather from './components/Weather'

const App = () => {
  return (
    <div className="app">
      <Weather />
      <Toaster position="top-center" />
    </div>
  )
}

export default 
App