import React, { useState } from 'react';
import Sistema from './components/sistemaClientes';
import Login from './components/login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return ( <>
   {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
  <Sistema/>
)}
    </>
  );
}

export default App;