import React, { useEffect, useState } from 'react';
import '../styles/SeleccionarProducto.css';

const SeleccionarProducto = ({ onSeleccionar }) => {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [animating, setAnimating] = useState(false); // Estado para la animación
  
  let touchStartX = 0;
  let touchEndX = 0;

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

  const handleSwipe = (direction) => {
    const currentIndex = categorias.indexOf(categoriaSeleccionada);
    if (direction === 'left' && currentIndex < categorias.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCategoriaSeleccionada(categorias[currentIndex + 1]);
        setAnimating(false);
      }, 200); // Duración de la animación en ms
    } else if (direction === 'right' && currentIndex > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCategoriaSeleccionada(categorias[currentIndex - 1]);
        setAnimating(false);
      }, 200);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      handleSwipe('left');
    } else if (touchEndX - touchStartX > 50) {
      handleSwipe('right');
    }
  };

  return (
    <div 
      className="seleccionar-producto-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
