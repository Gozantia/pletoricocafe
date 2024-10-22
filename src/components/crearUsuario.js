import React, { useState } from 'react';
import axios from 'axios';

const CrearUsuario = () => {
  // Estado para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [success, setSuccess] = useState(null); // Estado para el mensaje de éxito/error
  const [error, setError] = useState(null); // Estado para los errores

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const userData = {
      email: email,
      password: password,
      username: username,
      role: "colaborador"
    };

    try {
      // Realizar la solicitud POST a la API Gateway
      const response = await axios.post('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/users', userData);

      // Si la solicitud es exitosa
      setSuccess('Usuario creado exitosamente');
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (err) {
      // Si hay un error
      setError('Error al crear el usuario. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-usuario">
      <h2>Crear Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>

      {/* Mostrar mensajes de éxito o error */}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CrearUsuario;
