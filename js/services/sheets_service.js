/**
 * Servicio de Respaldo en la Nube (Google Sheets)
 * YogurtBusiness Pro v3.0 - Premium Edition
 */

const SheetsService = {
    // ESTA URL DEBE SER REEMPLAZADA POR EL ADMINISTRADOR DESPUÉS DE IMPLEMENTAR EL SCRIPT
    // Por ahora se guarda en localStorage si el admin la configura dinámicamente o se deja fija aquí
    BRIDGE_URL: "https://script.google.com/macros/s/AKfycbzxYvNiXqHtmbqwQQRJLFX4t6iVw5nCXCjyXZZz1TMGMM_vwtj_RewD4RtGkJ7F9d8VFg/exec",

    /**
     * Intenta sincronizar todos los datos al Master Bridge
     */
    async sincronizarTodo(sheetLink, data) {
        if (!this.BRIDGE_URL) {
            console.error("Master Bridge URL no configurada.");
            return { status: 500, message: "Error de configuración de red." };
        }

        try {
            const payload = {
                sheetLink: sheetLink,
                action: "SYNC_ALL",
                data: data
            };

            const response = await fetch(this.BRIDGE_URL, {
                method: 'POST',
                mode: 'no-cors', // Apps Script requiere no-cors o manejo de redirect
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Nota: Con 'no-cors' no podemos leer el body de la respuesta
            // Usaremos un truco de 'redirect' o simplemente asumiremos éxito si no hay error de red
            // Para una validación real necesitamos que el admin publique como "Cualquier persona"
            // y manejar el posible redirect de Google.

            return { status: 200, message: "Sincronización enviada (Procesando...)" };
        } catch (error) {
            console.error("Error Sync:", error);
            return { status: 500, message: "No se pudo conectar con la nube." };
        }
    },

    /**
     * Valida si un link de hoja es válido y está autorizado
     * (Usaremos un fetch normal aquí para obtener respuesta JSON)
     */
    async validarAcceso(sheetLink) {
        console.log("🔍 Intentando validar acceso para:", sheetLink);
        if (!this.BRIDGE_URL) {
            console.error("❌ ERROR: BRIDGE_URL no definida en sheets_service.js");
            return { status: 404, message: "URL de Bridge no configurada" };
        }

        try {
            const payload = {
                sheetLink: sheetLink,
                action: "VALIDATE"
            };

            console.log("📤 Enviando Payload:", payload);

            const resp = await fetch(this.BRIDGE_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const rawText = await resp.text();
            console.log("📥 Respuesta Cruda del Servidor:", rawText);

            try {
                const json = JSON.parse(rawText);
                return json;
            } catch (e) {
                console.warn("⚠️ La respuesta no es JSON, devolviendo texto plano.");
                return { status: resp.status, message: rawText };
            }

        } catch (error) {
            console.error("❌ Fallo en la comunicación con el Bridge:", error);
            return { status: 500, message: "Error de red: " + error.message };
        }
    }
};
