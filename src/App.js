import React, { useState } from 'react';
import ClientesActivos from './components/clientes-activos';
import AgregarProductos from './components/agregarProductos';
import Pagar from './components/pagar';
import CrearCliente from './components/crearCliente';
function App() {

  const [componenteActual, setComponenteActual] = useState('clientes-activos');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Guarda el cliente seleccionado

  const handleAgregarProductos = (mesa) => {
    setClienteSeleccionado(mesa);
    setComponenteActual('agregar-productos');
  };

  const handlePagar = (cliente) => {
    setClienteSeleccionado(cliente);
    setComponenteActual('pagar');
  };
  const volverClientesActivos = () => {
    setComponenteActual('clientes-activos');
  };

  // Función para cambiar al componente CrearCliente
  const handleCrearCliente = () => {
    setComponenteActual('crear-cliente');
  };




  return (
     <div>
      {componenteActual === 'clientes-activos' && (
        <ClientesActivos
          onAgregar={handleAgregarProductos}
          onPagar={handlePagar}
          onCrearCliente={handleCrearCliente}  // Pasar la función para crear cliente
          />
      )}
      {componenteActual === 'agregar-productos' && (
        <AgregarProductos
        mesa={clienteSeleccionado}
        volverClientesActivos={volverClientesActivos}
        />
      )}
      {componenteActual === 'pagar' && (
        <Pagar
      mesa={clienteSeleccionado}
      volverClientesActivos={volverClientesActivos}
       />
       )}
       {componenteActual === 'crear-cliente' && (
        <CrearCliente volverClientesActivos={volverClientesActivos} />
      )}
    </div>
  );
}

export default App;