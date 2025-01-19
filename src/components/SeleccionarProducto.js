import React, { useEffect, useState } from 'react';
import '../styles/SeleccionarProducto.css';

const SeleccionarProducto = ({ onSeleccionar }) => {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [animating, setAnimating] = useState(false); // Estado para la animación
  


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/productos');
        const data = await response.json();
        setProductos(data); 
        
        const categorias = [...new Set(data.map(producto => producto.categoria))].reverse();
        setCategorias(categorias);
        setCategoriaSeleccionada(categorias[0]);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const productosPorCategoria = productos.reduce((acc, producto) => {
    const { categoria } = producto;
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(producto);
    return acc;
  }, {});

  const handleSelectProducto = (producto) => {
    onSeleccionar(producto);
  };

 



  return (
    <div 
      className="seleccionar-producto-container"

    >
      <div className="categorias-tabs">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            className={`tab-button ${categoria === categoriaSeleccionada ? 'active' : ''}`}
            onClick={() => {
              setAnimating(true);
              setTimeout(() => {
                setCategoriaSeleccionada(categoria);
                setAnimating(false);
              }, 300);
            }}
            type="button" 
          >
            {categoria}
          </button>
        ))}
      </div>

      {/* Lista de productos con clase de animación */}
      <div className={`productos-grid ${animating ? 'animating' : ''}`}>
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
