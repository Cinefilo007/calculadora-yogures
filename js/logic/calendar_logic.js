/**
 * Lógica para la generación del calendario visual
 */
const CalendarLogic = {
    /**
     * Genera los datos necesarios para renderizar un mes en el calendario.
     */
    obtenerDatosMes(mes, año) {
        const primerDia = new Date(año, mes, 1).getDay(); // 0 (Dom) a 6 (Sab)
        const diasEnMes = new Date(año, mes + 1, 0).getDate();

        // Ajustar para que la semana empiece en Lunes (0=Lun, 6=Dom)
        // JS: 0=Dom, 1=Lun... -> Ajustado: (dia + 6) % 7
        const primerDiaAjustado = (primerDia + 6) % 7;

        const dias = [];
        // Celdas vacías al inicio
        for (let i = 0; i < primerDiaAjustado; i++) {
            dias.push({ dia: null, fecha: null });
        }

        // Días del mes
        for (let d = 1; d <= diasEnMes; d++) {
            const fecha = new Date(año, mes, d).toISOString().split('T')[0];
            dias.push({ dia: d, fecha: fecha });
        }

        return dias;
    },

    /**
     * Filtra las ventas con deudas pendientes para una fecha específica.
     */
    obtenerDeudasPorFecha(ventas, fechaStr) {
        return ventas.filter(v =>
            v.fechaCobro &&
            v.fechaCobro.startsWith(fechaStr) &&
            v.pagoRealizado < v.totalUsd
        );
    }
};
