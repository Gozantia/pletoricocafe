import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MesasList = () => {
    const [mesas, setMesas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState('disponible');
    const [editingMesa, setEditingMesa] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar las mesas existentes
    useEffect(() => {
        const fetchMesas = async () => {
            try {
                const response = await axios.get('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas');
                setMesas(response.data);
                console.log('Mesas cargadas:', response.data);
            } catch (err) {
                console.error('Error al obtener mesas', err);
                setError('No se pudieron cargar las mesas');
            }
        };

        fetchMesas();
    }, []);

    // Función para manejar la creación de una nueva mesa
    const handleCreateMesa = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newMesa = {
                Nombre: nombre,  // Capitalized field
                Estado: estado,  // Capitalized field
                Productos: [] // Puedes agregar esta propiedad vacía o lo que necesites
            };
            const response = await axios.post('https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas', newMesa);
            console.log('Nueva mesa creada:', response.data);
            setMesas((prevMesas) => [...prevMesas, response.data]); // Agregar la nueva mesa a la lista
            setNombre(''); // Limpiar el formulario
            setEstado('disponible'); // Restaurar el estado por defecto
        } catch (err) {
            console.error('Error al crear mesa', err);
            setError('No se pudo crear la mesa');
        } finally {
            setLoading(false);
        }
    };

    // Función para eliminar una mesa
    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas/${id}`);
            setMesas(mesas.filter(mesa => mesa.id !== id));
        } catch (error) {
            console.error('Error al eliminar la mesa:', error);
        }
    };

    // Función para editar una mesa (inicia el modo edición)
    const handleEditClick = (mesa) => {
        setEditingMesa(mesa);
        setNombre(mesa.Nombre);
        setEstado(mesa.Estado);
    };

    // Función para actualizar la mesa
    const handleUpdateMesa = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            const updatedMesa = {
                id: editingMesa.id,  // Aseguramos enviar el ID de la mesa
                Nombre: nombre,
                Estado: estado,
                Productos: editingMesa.Productos  // Mantenemos los productos existentes
            };
    
            // Hacemos la solicitud PUT al API Gateway con el formato correcto
            await axios.put(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas/${editingMesa.id}`, updatedMesa);
    
            // Actualizamos el estado de la mesa en la lista
            setMesas(mesas.map(mesa => (mesa.id === editingMesa.id ? updatedMesa : mesa)));
    
            setEditingMesa(null);  // Salimos del modo edición
            setNombre('');
            setEstado('disponible');
        } catch (err) {
            console.error('Error al actualizar la mesa', err);
            setError('No se pudo actualizar la mesa');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <h1>Clientes activos</h1>

            {/* Formulario para crear o editar una mesa */}
            <form onSubmit={editingMesa ? handleUpdateMesa : handleCreateMesa}>
                <div>
                    <label htmlFor="Nombre">Nuevo cliente:</label>
                    <input
                        type="text"
                        id="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="Estado">Estado:</label>
                    <select
                        id="Estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="disponible">Disponible</option>
                        <option value="ocupado">Ocupado</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? (editingMesa ? 'Actualizando...' : 'Creando...') : (editingMesa ? 'Actualizar Mesa' : 'Crear Mesa')}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul className='clientes-activos'>
                {mesas.map((mesa) => (
                    <li key={mesa.id}>
                        {mesa.Nombre} - {mesa.Estado}
                        <button onClick={() => handleEditClick(mesa)}>Editar</button>
                        <button onClick={() => handleDelete(mesa.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MesasList;
