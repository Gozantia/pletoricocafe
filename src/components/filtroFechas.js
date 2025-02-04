import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FiltroFechas = ({ onFilter }) => {
  const [tipo, setTipo] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleFilter = () => {
    if (!tipo || !startDate || !endDate) {
      alert("Por favor selecciona un tipo y ambas fechas.");
      return;
    }

    onFilter({
      tipo,
      fechaInicio: startDate.toISOString(),
      fechaFin: endDate.toISOString(),
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Filtrar Gastos</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <label className="block mb-2 font-medium">Tipo de gasto:</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Selecciona un tipo</option>
            <option value="Insumo">Insumo</option>
            <option value="Costo fijo">Costo fijo</option>
            <option value="Trabajador">Trabajador</option>
            <option value="Extra">Extra</option>
            <option value="Aseo">Aseo</option>
            <option value="Vacuna">Vacuna</option>
            <option value="insumo">insumo</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Fecha de Inicio:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Fecha de Fin:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      <button
        onClick={handleFilter}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Filtrar
      </button>
    </div>
  );
};

export default FiltroFechas;
