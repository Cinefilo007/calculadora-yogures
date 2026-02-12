/**
 * Punto de entrada de la aplicación
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar UI
    UI.init();

    // Obtener tasa del dólar del BCV
    const tasa = await BCVService.obtenerTasaDolar();
    if (tasa) {
        UI.setTasa(tasa);
    } else if (!UI.tasaDolar) {
        // Solo si no hay una tasa manual previa o cargada
        UI.setTasa(0);
    }

    console.log('Calculadora de Yogures iniciada correctamente.');
});
