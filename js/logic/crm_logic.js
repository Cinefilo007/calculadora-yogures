/**
 * Lógica pura para la gestión de clientes y ventas (CRM) - Edición Refinada.
 */
const CRMLogic = {
    /**
     * Formateador de moneda venezolana (es-VE).
     * Punto para miles, coma para decimales.
     */
    formatearBs(valor) {
        return new Intl.NumberFormat('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor);
    },

    /**
     * Formateador de dólares (formato internacional estético).
     */
    formatearUsd(valor) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor);
    },

    /**
     * Sanitiza números de WhatsApp eliminando el '0' inicial si existe.
     * Ejemplo: 04245762885 -> 4245762885
     */
    sanitizarWhatsApp(numero) {
        let limpio = numero.replace(/\D/g, ''); // Solo números
        if (limpio.startsWith('0')) {
            limpio = limpio.substring(1);
        }
        return limpio;
    },

    calcularDiasRestantes(fechaCobro) {
        const hoy = new Date();
        const cobro = new Date(fechaCobro);
        const diferencia = cobro - hoy;
        return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    },

    calcularPorcentajeTiempo(fechaInicio, fechaCobro) {
        const inicio = new Date(fechaInicio);
        const cobro = new Date(fechaCobro);
        const ahora = new Date();

        const total = cobro - inicio;
        const transcurrido = ahora - inicio;

        if (total <= 0) return 100;
        let porcentaje = (transcurrido / total) * 100;
        return Math.min(Math.max(porcentaje, 0), 100);
    },

    /**
     * Agrupa ventas por mes separando Contado y Crédito.
     */
    agruparVentasDualesPorMes(ventas, mes, año) {
        const diasEnMes = new Date(año, mes + 1, 0).getDate();
        const etiquetas = Array.from({ length: diasEnMes }, (_, i) => i + 1);
        const contado = new Array(diasEnMes).fill(0);
        const credito = new Array(diasEnMes).fill(0);

        ventas.forEach(v => {
            const f = new Date(v.fecha);
            if (f.getMonth() === mes && f.getFullYear() === año) {
                const dia = f.getDate() - 1;
                if (v.pagoRealizado >= v.totalUsd) contado[dia] += v.totalUsd;
                else credito[dia] += v.totalUsd;
            }
        });
        return { etiquetas, contado, credito };
    },

    /**
     * Agrupa ventas por año separando Contado y Crédito.
     */
    agruparVentasDualesPorAño(ventas, año) {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const contado = new Array(12).fill(0);
        const credito = new Array(12).fill(0);

        ventas.forEach(v => {
            const f = new Date(v.fecha);
            if (f.getFullYear() === año) {
                const m = f.getMonth();
                if (v.pagoRealizado >= v.totalUsd) contado[m] += v.totalUsd;
                else credito[m] += v.totalUsd;
            }
        });
        return { etiquetas: meses, contado, credito };
    },

    /**
     * Paginación universal.
     */
    obtenerPagina(lista, paginaActual, itemsPorPagina = 10) {
        const total = lista.length;
        const totalPaginas = Math.ceil(total / itemsPorPagina) || 1;
        const p = Math.min(Math.max(paginaActual, 1), totalPaginas);
        const inicio = (p - 1) * itemsPorPagina;
        return {
            items: lista.slice(inicio, inicio + itemsPorPagina),
            totalPaginas,
            paginaActual: p
        };
    },

    generarMensajeCobro(cliente, deuda, tasa) {
        const deudaBs = deuda * tasa;
        const msg = `Hola ${cliente.nombre}, espero que estés bien. Te escribo de *${localStorage.getItem('yogures_nombre_negocio') || 'mi negocio de yogures'}* para recordarte tu saldo pendiente:

🔹 *Total en Dólares:* $${this.formatearUsd(deuda)}
🔹 *Equivalente en Bolívares:* ${this.formatearBs(deudaBs)} Bs.
_(Calculado a la tasa de ${this.formatearBs(tasa)} Bs/$ del BCV)_

¡Gracias por tu compra! ✨`;
        return encodeURIComponent(msg);
    }
};
