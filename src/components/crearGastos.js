import React, { useState } from 'react';
import axios from 'axios';
import { useDiaTrabajo } from '../DiaTrabajoContext'; // Ruta corregida para el contexto
import GastosDia from './gastos-dia';
import EstadisticasGastosDia from './estadisticasComprasDia';
import { useNavigate } from 'react-router-dom';

const CrearGastos = () => {
  const dia = useDiaTrabajo();
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState(''); // Estado para el mensaje de éxito
  const [gastos, setGastos] = useState([
    { descripcion: '', cantidad: '', valor: '', medio: 'efectivo', tipo: 'insumo' },
  ]);
  const [loading, setLoading] = useState(false);

  const agregarFormulario = () => {
    setGastos([
      ...gastos,
      { descripcion: '', cantidad: '', valor: '', medio: 'efectivo', tipo: 'insumo' },
    ]);
  };

  const actualizarCampo = (index, campo, valor) => {
    const nuevosGastos = [...gastos];
    nuevosGastos[index][campo] = valor;
    setGastos(nuevosGastos);
  };

  const guardarGastos = async () => {
    try {
      if (!dia?.idDelDiaDeTrabajo) {
        throw new Error('El ID del día de trabajo no está disponible.');
      }

      if (gastos.some((gasto) => !gasto.descripcion || !gasto.cantidad || !gasto.valor || !gasto.medio || !gasto.tipo)) {
        alert('Por favor, completa todos los campos en todos los formularios.');
        return;
      }

      setLoading(true);

      // Preparamos el array de gastos con el ID del día de trabajo
      const gastosAEnviar = gastos.map((gasto) => ({
        dia_trabajo: dia.idDelDiaDeTrabajo,
        descripcion: gasto.descripcion,
        cantidad: parseInt(gasto.cantidad, 10),
        valor: parseFloat(gasto.valor),
        medio: gasto.medio,
        tipo: gasto.tipo,
      }));

      // Enviamos el array de gastos
      const response1 = await axios.post(
        'https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/gastos',
        { gastos: gastosAEnviar }
      );

      // Obtenemos los IDs de los gastos creados
      const gastosIds = response1.data.data.map((gasto) => ({ gasto_id: gasto.id }));

      // Vinculamos los IDs de los gastos al día de trabajo
      await axios.put(
        'https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/dia-trabajo/gastos',
        {
          dia_id: dia.idDelDiaDeTrabajo,
          gastos: gastosIds,
        }
      );
      setMensajeExito('¡Gastos registrados con éxito!');
      setGastos([{ descripcion: '', cantidad: '', valor: '', medio: '', tipo: '' }]);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container_egresos' >
            <EstadisticasGastosDia/>
      <h2>Registrar egresos</h2>
      {gastos.map((gasto, index) => (
        <div key={index} style={{ marginBottom: '10px' }} className='container_egresos-form'>
          <input
            type="text"
            placeholder="Descripción"
            value={gasto.descripcion}
            onChange={(e) => actualizarCampo(index, 'descripcion', e.target.value)}
            name="descripcion"
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={gasto.cantidad}
            onChange={(e) => actualizarCampo(index, 'cantidad', e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor"
            value={gasto.valor}
            onChange={(e) => actualizarCampo(index, 'valor', e.target.value)}
          />
          <span className="custom-dropdown big">
          <select
            value={gasto.medio}
            onChange={(e) => actualizarCampo(index, 'medio', e.target.value)}
          >
            <option value="">Medio</option>
            <option value="efectivo" defaultValue>efectivo</option>
            <option value="transferencia">transferencia</option>
          </select>
          </span>
          <span className="custom-dropdown big">
          <select
              value={gasto.tipo}
              onChange={(e) => actualizarCampo(index, 'tipo', e.target.value)}
              name ="tipo"
            >
              <option value="Insumo">insumo</option>
              <option value="Costo fijo">costo fijo</option>
              <option value="Trabajador">trabajador</option>
              <option value="Extra">extra</option>
              <option value="Aseo">aseo</option>
              <option value="Vacuna">vacuna</option>
            </select>
            </span>
        </div>
      ))}
       {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
      <div className="actions"> 
      <button onClick={agregarFormulario}>Agregar más</button>
      <button onClick={guardarGastos} disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Gastos'}
      </button>
      </div>

      <GastosDia/>
      <button onClick={() => navigate(`/sistema/estadisticas`)} > Estadísticas</button>
    </div>
  );
};

export default CrearGastos;
