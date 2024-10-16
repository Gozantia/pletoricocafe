import React, { useState } from 'react';
import ClientesActivos from './clientes-activos';
import AgregarProductos from './agregarProductos';
import Pagar from './pagar';
import CrearCliente from './crearCliente';
import ListaMesasPagadasHoy from './listaMesasPagadasHoy';
function Sistema() {

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
  const verListaMesasPagadasHoy = () => {
    setComponenteActual('mesas-pagadas-hoy');
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
          onCrearCliente={handleCrearCliente}
          onVerMesasPagadasHoy= {verListaMesasPagadasHoy}  // Pasar la función para crear cliente
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
        <CrearCliente
        volverClientesActivos={volverClientesActivos}
        onVerMesasPagadasHoy= {verListaMesasPagadasHoy}   />
      )}
      {componenteActual === 'mesas-pagadas-hoy' && (
        <ListaMesasPagadasHoy volverClientesActivos={volverClientesActivos} />
      )}

    </div>
  );
}

export default Sistema;