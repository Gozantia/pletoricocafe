import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDiaTrabajo } from '../DiaTrabajoContext';
import EstadisticasGastosDia from './estadisticasComprasDia';
import { FaPlus, FaTrash, FaCopy, FaSave, FaEdit, FaWindowClose } from "react-icons/fa";

/* import { useNavigate } from 'react-router-dom'; */

const GastosDia = () => { 
    const { idDelDiaDeTrabajo, forzarActualizacionGastos } = useDiaTrabajo();
    const [gastosDia, setGastosDia] = useState([]);
    const [error, setError] = useState(null);
    const [nuevosGastos, setNuevosGastos] = useState([]);
    const [mensajeExito, setMensajeExito] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(null);
    const [editedGasto, setEditedGasto] = useState({});
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
            forzarActualizacionGastos();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al procesar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (gasto) => {
        setEditMode(gasto.id);
        setEditedGasto({ ...gasto });
      };
    
      const handleEditInputChange = (e, field) => {
        setEditedGasto({ ...editedGasto, [field]: e.target.value });
      };

      


      const editGasto = async () => {
        setLoading(true);
        setError(null);
    
        try {
          const gastoActualizado = {
            id: editedGasto.id,
            dia_trabajo: idDelDiaDeTrabajo,
          };
    
          if (editedGasto.valor !== gastosDia.find(g => g.id === editedGasto.id).valor) {
            gastoActualizado.valor = editedGasto.valor;
          }
          if (editedGasto.descripcion !== gastosDia.find(g => g.id === editedGasto.id).descripcion) {
            gastoActualizado.descripcion = editedGasto.descripcion;
          }
          if (editedGasto.medio !== gastosDia.find(g => g.id === editedGasto.id).medio) {
            gastoActualizado.medio = editedGasto.medio;
          }
          if (editedGasto.tipo !== gastosDia.find(g => g.id === editedGasto.id).tipo) {
            gastoActualizado.tipo = editedGasto.tipo;
          }
    
          console.log("Datos enviados en PUT:", gastoActualizado);
    
          const response = await axios.put(
            `https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/gastos/${editedGasto.id}`,
            gastoActualizado
          );
    
          console.log("Respuesta de la API:", response.data);
          setMensajeExito("✅ Gasto actualizado correctamente.");
          setTimeout(() => {
            setMensajeExito(null);
          }, 3000);
          setEditMode(null);
          fetchGastos();
          forzarActualizacionGastos();
        } catch (err) {
          console.error("Error al actualizar el gasto", err);
          setError("No se pudo actualizar el gasto");
        } finally {
          setLoading(false);
        }
      };

      
      const handleRemoveNewGasto = (index) => {
        const updatedGastos = [...nuevosGastos];
        updatedGastos.splice(index, 1);
        setNuevosGastos(updatedGastos);
    };

      // Función que se activa al hacer clic en "Eliminar"
        const handleDeleteClick = (gasto) => {
            deleteGasto(gasto);
        };

        
        // Función para eliminar el gasto
  const deleteGasto = async (deletedGasto) => {
   
    const gastoToDelete = {
      id: deletedGasto.id,
      dia_trabajo: idDelDiaDeTrabajo,
    };

    // Confirmación antes de eliminar
    const isConfirmed = window.confirm("¿Estás seguro de eliminar este gasto?");
    if (!isConfirmed) return;

    try {
      setLoading(true);

      await axios.delete(
        `https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/gastos/${deletedGasto.id}`,
        { data: gastoToDelete } // Axios requiere que el body vaya dentro de "data" en DELETE
      );

      setMensajeExito("¡Gasto eliminado correctamente!");
      setTimeout(() => setMensajeExito(null), 3000);
      fetchGastos();
      forzarActualizacionGastos(); // Refrescar la lista de gastos si es necesario
    } catch (err) {
      console.error("Error al eliminar el gasto", err);
      setError("No se pudo eliminar el gasto");
    } finally {
      setLoading(false);
    }
  };


  const handleCopyClick = (gasto) => {
    const nuevoGasto = {
    id: Date.now(), // ID temporal solo para la UI
    descripcion: gasto.descripcion,
    valor: gasto.valor,
    cantidad: gasto.cantidad,
    tipo: gasto.tipo,
    medio: gasto.medio
    };
 setNuevosGastos([...nuevosGastos, nuevoGasto]);
};



    return (
        <section className='container'>
            <EstadisticasGastosDia/>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
            <div className='egresos-heading-block'>
            <h1>Egresos hoy </h1> 
            <button onClick={agregarFilaNuevoGasto}><FaPlus/></button>
            <button onClick={guardarGastos} disabled={!nuevosGastos.length || loading}>
                    <FaSave /> 
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
                        <th>Acciones</th>
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
                                <td className=' item-actions'>
                                     <button onClick={() => handleRemoveNewGasto(index)}> <FaWindowClose /> Cancelar </button>
                                     <button onClick={() => handleCopyClick(gasto)}><FaCopy/> Copiar </button> 
                                     </td>
                            </tr>
                 ))}

                 {gastosDia.map((gasto, index) => (
                   <tr key={index}>
                     {editMode === gasto.id ? (
                        <>
                        
                          <td  className='tabla__prod-nombre' >
                          <input
                                type="text"
                                value={editedGasto.descripcion}
                                onChange={(e) => handleEditInputChange(e, "descripcion")}
                            />  
                          </td> 
                          <td  className='tabla__prod-precio' >
                          <input
                                type="text"
                                value={editedGasto.valor}
                                onChange={(e) => handleEditInputChange(e, "valor")}
                            />  
                          </td>
                          <td>
                          <input
                                type="number"
                                value={editedGasto.cantidad}
                                onChange={(e) => handleEditInputChange(e, "cantidad")}
                           />
                          </td>  
                         <td>
                                 <select
                                    value={editedGasto.tipo} 
                                    onChange={(e) => handleEditInputChange(e, "tipo")}
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
                                    value={editedGasto.medio} 
                                    onChange={(e) => handleEditInputChange(e, "medio")}
                                >
                                    <option value="efectivo" defaultValue>efectivo</option>
                                    <option value="transferencia">transferencia</option>
                                </select>
                         </td>
                         <td className=' item-actions'>
                        <button onClick={editGasto} disabled={loading}>
                            {loading ? "Guardando..." : "Guardar"}
                        </button>    
                        </td>

                        </>
                    ) : (
                    <>
                     
                    <td  className='tabla__prod-nombre' >{gasto.descripcion}</td>
                    <td  className='tabla__prod-precio' >{gasto.valor}</td>
                    <td  className='tabla__prod-cantidad' >{gasto.cantidad}</td>
                    <td  className='tabla__prod-precio' >{gasto.tipo}</td>
                    <td  className='tabla__prod-precio' >{gasto.medio}</td>
                    <td className=' item-actions'> 
                     <button onClick={() => handleEditClick(gasto)}><FaEdit/>Editar</button>
                     <button onClick={() => handleCopyClick(gasto)}><FaCopy/>Copiar</button> 
                     <button onClick={() => handleDeleteClick(gasto)}><FaTrash/>Eliminar</button>
                     </td>  
                    </>
                )}
                 </tr>
                  ))}   
                </tbody>
                

            </table>
            </div>     
           
        </section>
    );
};

export default GastosDia;
