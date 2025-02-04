import React, { useState } from "react";
import FiltroFechas from "./filtroFechas";
import TablaResultados from "./tablaResultados";
const BuscadorGastos = () => {
  const [datos, setDatos] = useState([]);
  const handleFilter = (filtros) => {
    console.log("Parámetros de filtro:", filtros);

    fetch(
      `https://ddf7uggy3c.execute-api.us-east-2.amazonaws.com/mesas/gastos/filtro-gastos?tipo=${filtros.tipo}&fechaInicio=${filtros.fechaInicio}&fechaFin=${filtros.fechaFin}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos filtrados:", data);
        setDatos(data);
      })
      .catch((error) => {
        console.error("Error al filtrar:", error);
        setDatos([]);
      });
  };

  return (
    <div >
      <h1 className="">Filtrar Gastos</h1>
      <FiltroFechas onFilter={handleFilter} />
      <TablaResultados datos={datos} />
    </div>
  );
};

export default BuscadorGastos;
