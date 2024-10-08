import React, { useEffect, useState } from 'react';

const SeleccionarProducto = ({ onSeleccionar }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/productos');
        const data = await response.json();
        setProductos(data); // Ajusta esto según la estructura de tu JSON
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const productoSeleccionado = productos.find((producto) => producto.nombre === e.target.value);
    onSeleccionar(productoSeleccionado);
  };

  return (
    <div>
      <label htmlFor="productos">Seleccionar Producto:</label>
      <select onChange={handleChange} defaultValue="">
        <option value="" disabled>Agrega producto</option>
        {productos.map((producto) => (
          <option key={producto.id} value={producto.nombre}>
            {producto.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeleccionarProducto;
