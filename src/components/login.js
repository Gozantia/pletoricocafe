import React, { useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const Entrar = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    //const navigate = useNavigate(); // Inicializar useNavigate

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/users/login', {
                username,
                password
            });
            const data = JSON.parse(response.data.body); // Parsear el body del JSON
            if (data.message === "Inicio de sesión exitoso") {
              const { id, role, username } = data;
              onLogin(role, id, username); // Solo llamar a onLogin si el login es exitoso
              //navigate(`/mi-perfil/${data.id}`); // Redirigir a la ruta de MiPerfil
          } else {
              setError("Inicio de sesión fallido. Credenciales incorrectas.");
          }
          
        } catch (err) {
            console.error("Error during login:", err);
            setError("Inicio de sesión fallido. Verifica tus credenciales.");
        }
    };

    return (
        <div className='login-container'>
            <h2>Iniciar Sesión</h2>
            <div>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin} tabIndex="0">Iniciar Sesión</button>
            {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default Entrar;
