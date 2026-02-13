/**
 * Servicio para registro de usuarios y telemetría (Puente centralizado)
 */
const TelemetriaService = {
    // URL del script de Apps Script del desarrollador (por definir por el usuario)
    URL_PUENTE: '',

    async registrarNegocio(datos) {
        if (!this.URL_PUENTE) {
            console.warn('URL del puente no configurada. Saltando telemetría.');
            return false;
        }

        try {
            const response = await fetch(this.URL_PUENTE, {
                method: 'POST',
                mode: 'no-cors', // Apps Script suele requerir no-cors o manejarlo vía GET/POST específico
                body: JSON.stringify({
                    type: 'registro',
                    ...datos,
                    timestamp: new Date().toISOString()
                })
            });
            return true;
        } catch (error) {
            console.error('Error al registrar telemetría:', error);
            return false;
        }
    }
};
