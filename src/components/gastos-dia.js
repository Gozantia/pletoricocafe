import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDiaTrabajo } from '../DiaTrabajoContext';
/* import { useNavigate } from 'react-router-dom'; */

const GastosDia = () => { 
    const { idDelDiaDeTrabajo } = useDiaTrabajo();
    const [gastosDia, setGastosDia] = useState([]);
    const [error, setError] = useState(null);
    const [nuevosGastos, setNuevosGastos] = useState([]);
    const [mensajeExito, setMensajeExito] = useState('');
    const [loading, setLoading] = useState(false);
    /* const navigate = useNavigate(); */

    // Función memoizada para cargar las Gastos existentes
    const fetchGastos = useCallback(async () => {
        if (!idDelDiaDeTrabajo) return;
        try {
            const response = await axios.get(`https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/${idDelDiaDeTrabajo}/gastos`);
            setGastosDia(response.data);
           
        } catch (err) {
            console.error('Error al obtener los egresos', err);
            setError('Aún no hemos comprado una mondá');
        }
    }, [idDelDiaDeTrabajo]);

    // Cargar mesas al montar el componente
  
    useEffect(() => {
        fetchGastos();
    }, [fetchGastos]);


    

    // Agregar una nueva fila vacía
    const agregarFilaNuevoGasto = () => {
        setNuevosGastos(prev => [
            { descripcion: '', cantidad: 1, valor: 0, medio: 'efectivo', tipo: 'Insumo' },
            ...prev
        ]);
    };


      // Manejar cambios en los inputs de la nueva fila

    const handleInputChange = (index, campo, valor) => {
        setNuevosGastos(prev => 
            prev.map((gasto, i) => i === index ? { ...gasto, [campo]: valor } : gasto)
        );
    };

  
    // Guardar los gastos y vincularlos al día de trabajo
     const guardarGastos = async () => {
        try {
            if (!idDelDiaDeTrabajo) {
                throw new Error('El ID del día de trabajo no está disponible.');
            }

            if (nuevosGastos.some(gasto => !gasto.descripcion || !gasto.cantidad || !gasto.valor || !gasto.medio || !gasto.tipo)) {
                alert('Por favor, completa todos los campos en todos los formularios.');
                return;
            }

            setLoading(true);

            // Preparar los gastos con el ID del día de trabajo
            const gastosAEnviar = nuevosGastos.map(gasto => ({
                dia_trabajo: idDelDiaDeTrabajo,
                descripcion: gasto.descripcion,
                cantidad: parseInt(gasto.cantidad, 10),
                valor: parseFloat(gasto.valor),
                medio: gasto.medio,
                tipo: gasto.tipo,
            }));

            // Enviar los gastos a la API
            const response1 = await axios.post(
                'https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/gastos',
                { gastos: gastosAEnviar }
            );

            // Obtener los IDs de los gastos creados
            const gastosIds = response1.data.data.map(gasto => ({ gasto_id: gasto.id }));

            // Asociar los IDs al día de trabajo
            await axios.put(
                'https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/gastos',
                {
                    dia_id: idDelDiaDeTrabajo,
                    gastos: gastosIds,
                }
            );

            setMensajeExito('¡Gastos registrados con éxito!');
            setNuevosGastos([]); // Limpiar las filas nuevas
            fetchGastos(); // Recargar los gastos existentes
             // Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                setMensajeExito(null);
            }, 3000);
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al procesar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
            <div className='egresos-heading-block'>
            <h1>Egresos hoy </h1> 
            <button onClick={agregarFilaNuevoGasto}>+</button>
            <button onClick={guardarGastos} disabled={!nuevosGastos.length || loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
            </button>
            </div>
            <div className="table-container">
            <table className='products-table gastos-table'>
                <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Valor</th>
                        <th>Cantidad</th>
                        <th>Tipo</th>
                        <th>Medio</th>
                    </tr>
                </thead>
                <tbody>
                 {/* Fila de inputs para nuevo gasto */}
                 {/* Filas para los nuevos gastos */}
                 {nuevosGastos.map((gasto, index) => (
                            <tr key={`nuevo-${index}`}>
                                <td className='tabla__prod-nombre'>
                                    <input type="text"
                                    value={gasto.descripcion}
                                    onChange={(e) => handleInputChange(index, 'descripcion', e.target.value)}
                                    /></td>
                                <td className='tabla__prod-precio'>
                                    <input type="number"
                                        value={gasto.valor}
                                        onChange={(e) => handleInputChange(index, 'valor', e.target.value)} 
                                     />
                                </td>
                                <td className='tabla__prod-cantidad'>
                                    <input type="number"
                                    value={gasto.cantidad}
                                    onChange={(e) => handleInputChange(index, 'cantidad', e.target.value)} 
                                    />
                                </td>
                                <td>
                                <select
                                    value={gasto.tipo || 'Insumo'} 
                                    onChange={(e) => handleInputChange(index, 'tipo', e.target.value)}
                                >
                                   <option value="Insumo">insumo</option>
                                    <option value="Costo fijo">costo fijo</option>
                                    <option value="Trabajador">trabajador</option>
                                    <option value="Extra">extra</option>
                                    <option value="Aseo">aseo</option>
                                    <option value="Vacuna">vacuna</option>
                                 </select>
                                </td>
                                <td>
                                <select
                                    value={gasto.medio || 'efectivo'} 
                                    onChange={(e) => handleInputChange(index, 'medio', e.target.value)} 
                                >
                                    <option value="efectivo" defaultValue>efectivo</option>
                                    <option value="transferencia">transferencia</option>
                                </select>
                                    
                                </td>
                            </tr>
                 ))}

                 {gastosDia.map((gasto, index) => (
                   <tr key={index}>
                    <td  className='tabla__prod-nombre' >{gasto.descripcion}</td>
                    <td  className='tabla__prod-precio' >{gasto.valor}</td>
                    <td  className='tabla__prod-cantidad' >{gasto.cantidad}</td>
                    <td  className='tabla__prod-precio' >{gasto.tipo}</td>
                    <td  className='tabla__prod-precio' >{gasto.medio}</td>
                 </tr>
                  ))}   
                </tbody>
                
            </table>
            </div>     
           
        </section>
    );
};

export default GastosDia;
