import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/pletoricologo-white.png';
import { useDiaTrabajo } from '../DiaTrabajoContext';

const Header = ({ isAuthenticated, userId, role, setIsAuthenticated, setRole, setUserId, userUsername  }) => {
  const navigate = useNavigate(); // Inicializar useNavigate para redirecciones
  const { idDelDiaDeTrabajo, loading } = useDiaTrabajo();
  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null); // Limpiar el rol
    setUserId(null); // Limpiar el ID
    localStorage.removeItem('isAuthenticated'); // Limpiar el localStorage al cerrar sesión
    localStorage.removeItem('userRole');  // Limpiar el rol del usuario en localStorage
    localStorage.removeItem('userId'); // Limpiar el userId del localStorage
    navigate('/'); // Redirigir a la ruta raíz
  
    
  
  };
  if (loading) {
    return <span>Cargando...</span>;
  }
  return (
    <header>
      <img className='logo' src={logo} alt='logo'/>
    <nav>
      <ul className='mainNav'>
      {isAuthenticated && ( 
      <>
           <li><Link to={`/sistema/clientes-activos/${idDelDiaDeTrabajo}`}>Activos</Link></li>
           <li><Link to="/sistema/mesas-pagadas">Pagados</Link></li>
      
       </>
      )}
       </ul>
      {isAuthenticated && (
          <>
          <ul className="userNav">
            <li className="userNavName" tabIndex="0"> <h4> {userUsername } </h4> <svg xmlns="http://www.w3.org/2000/svg" version="2.0" focusable="false" aria-hidden="true" className="globalNav" viewBox="0 0 16 16"><path d="M4 11h8L8 5l-4 6z"></path></svg> </li>
            <ul>
           
            {userId && <li><Link to={`/mi-perfil/${userId}`}>Mi Perfil</Link></li>}
            {role === 'manager' && <li><Link to="/crea-usuario">Crear Usuario</Link></li>}
            
            {role === 'manager' && <li><Link to="/sistema/ventas-mes">Ventas mes actual</Link></li>}
            <li><button onClick={handleLogout}>Salir</button></li>
            </ul>
          </ul>
          </>
        )}
      
    </nav>
  </header>
  );
};

export default Header;
