export const formatearDinero = (cantidad) =>{
    return Number(cantidad).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
    })
}

export const crearId = ( ) => {
    const fecha = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return fecha + random
}

export const formatearFecha = (fecha) => {
    const fechaNueva = new Date(fecha);
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }

    return fechaNueva.toLocaleDateString('es-Es', opciones);
}