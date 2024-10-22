import React, { useState } from 'react';
import axios from 'axios';

const ActualizarPassword = ({ userId }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleUpdatePassword = async () => {
        try {
            const response = await axios.put(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/users/${userId}`, {
                old_password: oldPassword,
                new_password: newPassword,
            });
           
            setSuccess(response.data); // Manejar la respuesta exitosa
            setError(''); // Limpiar el mensaje de error si la actualización fue exitosa
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            setError(error.response ? error.response.data : "Error al actualizar la contraseña.");
        }
    };

    return (
        <div>
            <h3>Actualizar Contraseña</h3>
            <input
                type="password"
                placeholder="Contraseña antigua"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleUpdatePassword}>Actualizar Contraseña</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default ActualizarPassword;
