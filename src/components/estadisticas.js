import React, { useState } from 'react';
import GastosDelMes from './gastosMes';
import VentasDelMes from './ventasMes';

const Estadisticas = () => { 
    const [totalGastos, setTotalGastos] = useState(0);
    const handleTotalGastosChange = (nuevoTotal) => {
        setTotalGastos(nuevoTotal);
    };
    const [totalVentas, setTotalVentas] = useState(0);
    const handleTotalVentasChange = (nuevoTotal) => {
        setTotalVentas(nuevoTotal);
    };
 return(
    <div >
         <h1>Resumen de Mes</h1>
         <div className='summary-stats stats-box'> 
         <span>Ventas: <h2>{totalVentas.toLocaleString('es-ES')}</h2> </span>
         <span>Egresos:<h2>{totalGastos.toLocaleString('es-ES')}</h2></span>
         </div>  
        <div className='stats-chart'>
        <VentasDelMes onTotalVentasChange={handleTotalVentasChange}/>
        </div>
        <div className='stats-chart'>
        <GastosDelMes onTotalGastosChange={handleTotalGastosChange}/>
        </div>
    </div>
 ) 
 

}
export default Estadisticas;