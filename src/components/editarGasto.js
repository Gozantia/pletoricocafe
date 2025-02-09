import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDiaTrabajo } from "../DiaTrabajoContext";

const EditarGasto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { idDelDiaDeTrabajo } = useDiaTrabajo();
  const [gasto, setGasto] = useState(null);
  const [originalGasto, setOriginalGasto] = useState(null); // Guardamos el original
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const diaId = idDelDiaDeTrabajo;

  const fetchGasto = async () => {
    if (!diaId) {
      setError("No hay un día de trabajo activo.");
      return;
    }

    setLoading(true);
    setError(null);
    setGasto(null);

    try {
      const apiUrl = `https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/gastos/${id}`;

      const response = await axios.get(apiUrl, {
        params: {
          dia_trabajo: diaId,
        },
      });

      setGasto(response.data.data);
      setOriginalGasto(response.data.data); // Guardamos el gasto original
      console.log("Gasto cargado:", response.data.data);
      
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.data.error}`);
      } else if (err.request) {
        setError("No response received from the server.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (diaId) {
      fetchGasto();
    }
  }, [id, diaId]);

  const editGasto = async () => {
    setLoading(true);
    setError(null);

    try {
      const gastoActualizado = {
        id: gasto.id,
        dia_trabajo: diaId,
      };

      if (gasto.valor !== originalGasto.valor) {
        gastoActualizado.valor = gasto.valor;
      }
      if (gasto.descripcion !== originalGasto.descripcion) {
        gastoActualizado.descripcion = gasto.descripcion;
      }
      if (gasto.medio !== originalGasto.medio) {
        gastoActualizado.medio = gasto.medio;
      }
      if (gasto.tipo !== originalGasto.tipo) {
        gastoActualizado.tipo = gasto.tipo;
      }

      console.log("Datos enviados en PUT:", gastoActualizado);

      const response = await axios.put(
        `https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/gastos/${gasto.id}`,
        gastoActualizado
      );

      console.log("Respuesta de la API:", response.data);
      setSuccessMessage("✅ Gasto actualizado correctamente.");
       // Ocultar el mensaje después de 3 segundos
       setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err) {
      console.error("Error al actualizar el gasto", err);
      setError("No se pudo actualizar el gasto");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setGasto({ ...gasto, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Editar Gasto</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <div className="successMessage" style={{ color: "green" }}>{successMessage}</div>}  
      {gasto && (
        <div>
          <label>
            Descripción:
            <input
              type="text"
              name="descripcion"
              value={gasto.descripcion}
              onChange={handleChange}
            />
          </label>

          <label>
            Medio:
            <select
              name="medio"
              value={gasto.medio}
              onChange={handleChange}
           >
           
            <option value="efectivo" defaultValue>efectivo</option>
            <option value="transferencia">transferencia</option>
          </select>
          </label>

          <label>
            Tipo:
            <select
              name="tipo"
              value={gasto.tipo}
              onChange={handleChange}
           >
              <option value="Insumo">insumo</option>
              <option value="Costo fijo">costo fijo</option>
              <option value="Trabajador">trabajador</option>
              <option value="Extra">extra</option>
              <option value="Aseo">aseo</option>
              <option value="Vacuna">vacuna</option>
            </select>
          </label>

          <label>
            Valor:
            <input
              type="number"
              name="valor"
              value={gasto.valor}
              onChange={handleChange}
            />
          </label>

          <button onClick={editGasto}>Guardar</button>
          <button onClick={() => navigate(`/sistema/egresos`)} >Volver a los gastos del día</button>
        </div>
      )}
    </div>
  );
};

export default EditarGasto;
