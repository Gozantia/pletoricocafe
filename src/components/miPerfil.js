import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ActualizarPassword from './actualizarPassword'; // Importar el nuevo componente

const MiPerfil = () => {
    const { id } = useParams(); // Obtener el ID desde los parámetros de la URL
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/users/${id}`);
                
                // Si la respuesta viene directamente en formato JSON, no es necesario hacer JSON.parse
                const data = response.data.body ? JSON.parse(response.data.body) : response.data;
                setUserData(data);
                console.log(data)
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("No se pudo cargar la información del perfil.");
            }
        };

        if (id) { // Solo hacer la llamada si el id está definido
            fetchUserData();
        }
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!userData) {
        return <p>Cargando...</p>;
    }
    return (
        <div>
            <h2>Mi Perfil</h2>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>


            {/* Incluir el componente de actualización de contraseña */}
            <ActualizarPassword userId={id} />
        </div>
    );
};

export default MiPerfil;
