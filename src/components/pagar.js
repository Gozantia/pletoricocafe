import React from 'react';
function Pagar({mesa, volverClientesActivos}){
    return (  
        <div>
            <h2>Pagar para {mesa.Nombre} </h2>
            <button onClick={volverClientesActivos}>Volver a Clientes Activos</button>
        </div>
    );
}

export default Pagar;