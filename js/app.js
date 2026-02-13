/**
 * Punto de entrada de la aplicación
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar la interfaz de usuario
    UI.init();

    // Intentar obtener la tasa oficial del BCV
    console.log('Obteniendo tasa oficial BCV...');
    try {
        const tasa = await BCVService.obtenerTasaDolar();
        if (tasa) {
            UI.setTasa(tasa);
            console.log('Tasa BCV cargada:', tasa);
        } else if (!UI.tasaDolar) {
            UI.setTasa(0);
            console.warn('No se pudo obtener la tasa y no hay tasa manual guardada.');
        }
    } catch (error) {
        console.error('Error al iniciar servicios:', error);
    }

    console.log('🍦 YogurtBusiness listo para trabajar.');
});
