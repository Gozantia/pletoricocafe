import React, { useEffect, useState } from 'react';
import '../styles/SeleccionarProducto.css'; // Archivo CSS para estilos

const SeleccionarProducto = ({ onSeleccionar }) => {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/productos');
        const data = await response.json();
        setProductos(data); 
        
        // Selecciona la primera categoría por defecto
        const categorias = [...new Set(data.map(producto => producto.categoria))];
        setCategoriaSeleccionada(categorias.reverse()[0]); // Categoría invertida (última categoría primero)
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, []);

  // Agrupar productos por categoría
  const productosPorCategoria = productos.reduce((acc, producto) => {
    const { categoria } = producto;
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(producto);
    return acc;
  }, {});

  // Manejar la selección de un producto
  const handleSelectProducto = (producto) => {
    onSeleccionar(producto);
  };

  return (
    <div className="seleccionar-producto-container">
      <h3>Agrega productos</h3>

      {/* Pestañas de categorías */}
      <div className="categorias-tabs">
        {Object.keys(productosPorCategoria).reverse().map((categoria) => (
          <button
            key={categoria}
            className={`tab-button ${categoria === categoriaSeleccionada ? 'active' : ''}`}
            onClick={() => setCategoriaSeleccionada(categoria)}
            type="button" 
          >
            {categoria}
          </button>
        ))}
      </div>

      {/* Lista de productos según la categoría seleccionada */}
      <div className="productos-grid">
        {productosPorCategoria[categoriaSeleccionada]?.map((producto) => (
          <div
            key={producto.id}
            className="producto-item"
            onClick={() => handleSelectProducto(producto)}
          >
            <div className="producto-nombre">{producto.nombre}</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SeleccionarProducto;
