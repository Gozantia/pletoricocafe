import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDiaTrabajo } from '../DiaTrabajoContext'; // Importar el contexto

const EstadisticasGastosDia = () => {
    const { idDelDiaDeTrabajo } = useDiaTrabajo(); // Obtener el ID del contexto
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!idDelDiaDeTrabajo) {
            return; // Esperar a que el ID esté disponible
        }

        const obtenerTotales = async () => {
            setLoading(true);
            try {
                const response = await axios.put(
                    `https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/${idDelDiaDeTrabajo}/gastos`,
                    {
                        pathParameters: {
                            id: idDelDiaDeTrabajo,
                        },
                    }
                );

                console.log("Respuesta de Lambda:", response.data);

                if (response.data.updated_attributes) {
                    setResultado(response.data.updated_attributes);
                } else {
                    setError("El endpoint no devolvió los atributos actualizados.");
                }
            } catch (err) {
                console.error("Error al obtener los totales:", err);
                setError("No se pudo cargar la información de los gastos.");
            } finally {
                setLoading(false);
            }
        };

        obtenerTotales();
    }, [idDelDiaDeTrabajo]); // Dependencia del ID del día de trabajo

    if (!idDelDiaDeTrabajo) {
        return <p>Esperando el ID del día de trabajo...</p>;
    }

    if (loading) {
        return <p>Cargando estadísticas...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            maxWidth: "300px",
            margin: "20px auto",
            textAlign: "center"
        }}>
            <h3>Compras del día</h3>
            {resultado ? (
                <>
                    <p><strong>Transferencia:</strong> ${resultado.gastos_transferencia}</p>
                    <p><strong>Efectivo:</strong> ${resultado.gastos_efectivo}</p>
                    <p><strong>Total:</strong> ${resultado.total_gastos}</p>
                </>
            ) : (
                <p>No se encontraron datos.</p>
            )}
        </div>
    );
};

export default EstadisticasGastosDia;
