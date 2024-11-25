import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import TablaProductos from './tablaProductos';

function VerCliente({role}) {
    const { id } = useParams(); // Obtener el id de la URL
    const [productosMesa, setProductosMesa] = useState([]);
    const [mesaInfo, setMesaInfo] = useState(null); // Estado para guardar la información de la mesa
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // Consultar la información de la mesa y sus productos
    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/mesas/${id}`);
                setProductosMesa(response.data.Productos); // Asumimos que la respuesta contiene una propiedad 'Productos'
                setMesaInfo(response.data); // Guardar toda la información de la mesa
                console.log(response.data)
            } catch (err) {
                console.error('Error al obtener los productos de la mesa', err);
                setError('No se pudieron cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, [id]);

    // Función para calcular el total acumulado
    const calcularTotalAcumulado = () => {
        return productosMesa.reduce((total, producto) => {
            return total + (producto.cantidad * producto.precio);
        }, 0).toFixed(0);
    };

    console.log("aquí va el rol", role )
    return (
        <section className='container ver-clientes'>
            {loading && <p>Cargando productos...</p>}
            {error && <p>{error}</p>}
            
            {mesaInfo ? (
                <>
                    <h2 className='nombre-cliente'>{mesaInfo.Nombre} {role === 'manager' ? <Link to={`/sistema/editar-cliente/${mesaInfo.id}`}><button>editar</button></Link> : "" }
                    </h2> 

                
                    {/* Tabla de productos con el componente reutilizable */}
                    <TablaProductos 
                        productos={productosMesa} 
                        setProductos={setProductosMesa} 
                        calcularTotalAcumulado={calcularTotalAcumulado} 
                    />
                    <p>Método pago: <strong>{mesaInfo.MedioPago}</strong> </p>
                                    </>
            ) : (
                <p>Cargando información de la mesa...</p>
            )}
        </section>
    );
}

export default VerCliente;
