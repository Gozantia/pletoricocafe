// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import CrearUsuario from './components/crearUsuario';
import MiPerfil from './components/miPerfil';
import Header from './components/header'; // Importa el nuevo componente
import ListaMesasPagadasHoy from './components/listaMesasPagadasHoy';
import CrearCliente from './components/crearCliente';
import VentasMes from './components/ventas-mes';
import ClientesActivosDia from './components/clientes-activos-dia';
import ClientesPagadosDia from './components/clientes-pagados-dia';
import ClientesActivos from './components/clientes-activos';
import EditarCliente from './components/editarCliente';

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true' || false;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('userRole') || '';  
  });

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });
  const [userUsername, setUserUsername] = useState(() => {
    return localStorage.getItem('userUsername') || null;
  });
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('userRole', role); 
    localStorage.setItem('userId', userId); 
    localStorage.setItem('userUsername', userUsername); 
  }, [isAuthenticated, role, userId, userUsername]);

  const handleLogin = (userRole, id, userUsername) => {
    setIsAuthenticated(true);
    setRole(userRole);
    setUserId(id);
    setUserUsername(userUsername);
  };

  return (
    <Router>
      {/* Usa el componente Header y pasa las props necesarias */}
      <Header 
        isAuthenticated={isAuthenticated} 
        userId={userId} 
        role={role} 
        setIsAuthenticated={setIsAuthenticated} 
        setRole={setRole} 
        setUserId={setUserId} 
        userUsername={userUsername}
      />
      <main>
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/sistema" />}
        />
        <Route
          path="/sistema"
          element={isAuthenticated ? <ClientesActivos /> : <Navigate to="/" />}
        />
        <Route
          path="/sistema/crear-cliente"
          element={isAuthenticated ? <CrearCliente /> : <Navigate to="/" />}
        />
        <Route
          path="/sistema/mesas-pagadas"
          element={isAuthenticated ? <ClientesPagadosDia /> : <Navigate to="/" />}
        />
        <Route
          path="/sistema/editar-cliente/:id"
          element={isAuthenticated ? <EditarCliente /> : <Navigate to="/" />}
        />
        
        <Route
          path="/sistema/clientes-activos/:id"
          element={isAuthenticated ? <ClientesActivosDia /> : <Navigate to="/" />}
        />

        <Route
          path="/crea-usuario"
          element={isAuthenticated && role === 'manager' ? <CrearUsuario /> : <Navigate to="/" />}
        />
        <Route
          path="/sistema/ventas-mes"
          element={isAuthenticated ? <VentasMes /> : <Navigate to="/" />}
        />
        <Route path="/mi-perfil/:id" element={<MiPerfil />} />
      </Routes>
    </main>
    </Router>
   
  );
};

export default App;
