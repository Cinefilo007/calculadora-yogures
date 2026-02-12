/**
 * Lógica de negocio para los cálculos de la calculadora
 */
const Calculadora = {
    /**
     * Calcula el costo unitario basado en el precio total y la cantidad total.
     */
    calcularCostoUnitario(precio, cantidad) {
        if (cantidad <= 0) return 0;
        return precio / cantidad;
    },

    /**
     * Calcula el costo de una porción usada en una receta.
     */
    calcularCostoPorcion(costoUnitario, cantidadUsada) {
        return costoUnitario * cantidadUsada;
    },

    /**
     * Calcula el precio de venta sugerido aplicando el margen de ganancia.
     * Formula: Costo + (Costo * Margen)
     */
    calcularPrecioSugerido(costoTotal, margen) {
        return costoTotal * (1 + parseFloat(margen));
    },

    /**
     * Convierte de Bolívares a Dólares.
     */
    bsADolar(bolivares, tasa) {
        if (!tasa || tasa <= 0) return 0;
        return bolivares / tasa;
    }
};
