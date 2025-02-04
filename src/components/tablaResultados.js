import React from "react";

const TablaResultados = ({ datos }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">Resultados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Tipo</th>
              <th className="border px-4 py-2">Descripción</th>
              <th className="border px-4 py-2">Monto</th>
              <th className="border px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {datos.length > 0 ? (
              datos.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border px-4 py-2">{item.id}</td>
                  <td className="border px-4 py-2">{item.tipo}</td>
                  <td className="border px-4 py-2">{item.descripcion}</td>
                  <td className="border px-4 py-2">${item.valor}</td>
                  <td className="border px-4 py-2">{item.fecha}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border px-4 py-2 text-center text-gray-500">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaResultados;
