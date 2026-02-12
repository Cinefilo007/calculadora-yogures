/**
 * Servicio para obtener la tasa oficial del BCV
 */
const BCVService = {
    // Intentamos con corsproxy.io que suele ser más permisivo con orígenes nulos
    async obtenerTasaDolar() {
        const urlBCV = 'https://www.bcv.org.ve/';
        const proxy = `https://corsproxy.io/?${encodeURIComponent(urlBCV)}`;

        try {
            const response = await fetch(proxy);
            if (!response.ok) throw new Error('Proxy no disponible');

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Selector específico de la tasa USD en el BCV
            const dolarElement = doc.querySelector('#dolar strong');

            if (dolarElement) {
                const valorTexto = dolarElement.textContent.trim().replace(',', '.');
                return parseFloat(valorTexto);
            } else {
                // Regex de respaldo
                const match = html.match(/USD<\/td>\s*<td[^>]*>\s*<strong>\s*([\d,]+)\s*<\/strong>/i);
                if (match) return parseFloat(match[1].replace(',', '.'));
                throw new Error('Elemento no encontrado');
            }
        } catch (error) {
            console.error('Error BCV:', error);
            return null;
        }
    }
};
