import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const MesaDetail = ({ data }) => {
  const { nombre } = useParams(); // Obtenemos el nombre de la mesa desde la URL

  // Encontramos la mesa en los datos
  const mesa = data.find(item => item.nombre === nombre);

  // Hooks deben estar fuera de cualquier condicional
  const [estadoMesa, setEstadoMesa] = useState(mesa ? mesa.estado : ''); // Se inicializa con el estado de la mesa o cadena vacía
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Para manejar errores

  // Si no se encuentra la mesa, mostramos un mensaje de error
  if (!mesa) {
    return <p>No se encontró información para esta mesa.</p>;
  }

  // Función que actualiza el estado de la mesa en el servidor
  const toggleEstadoMesa = () => {
    const nuevoEstado = estadoMesa === 'libre' ? 'ocupado' : 'libre';

    // Indicamos que la solicitud a la API está en progreso
    setLoading(true);
    setError(null);

    // Llamada a la API para actualizar el estado
    fetch(`https://v1.slashapi.com/pletorico/google-sheets/eSbsaly8DH/mesas/${mesa.row_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: nuevoEstado }), // Enviamos el nuevo estado
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al actualizar el estado de la mesa');
        }
        return response.json();
      })
      .then(data => {
        setEstadoMesa(nuevoEstado); // Actualizamos el estado local si la solicitud fue exitosa
      })
      .catch(error => {
        setError('No se pudo actualizar el estado de la mesa. Intente nuevamente.');
      })
      .finally(() => {
        setLoading(false); // Terminamos el proceso de carga
      });
  };

  return (
    <div>
      <h2>Nombre cliente: {mesa.nombre}</h2>
      <p>Estado: {estadoMesa}</p> {/* Mostramos el estado actual de la mesa */}
      <button onClick={toggleEstadoMesa} disabled={loading}>
        {loading ? 'Actualizando...' : (estadoMesa === 'libre' ? 'Ocupar Mesa' : 'Liberar Mesa')}
      </button>

      {/* Mostrar mensaje de error si algo falla */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MesaDetail;
