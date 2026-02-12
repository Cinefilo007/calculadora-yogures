/**
 * Manejador principal de la interfaz de usuario
 */
const UI = {
    ingredientes: [], // {id, nombre, precio, cantidad, costoUnitario}
    receta: [], // {ingredienteId, nombre, cantidadUsada, costoPorcion}
    tasaDolar: 0,

    init() {
        this.cargarDatos();
        this.cacheDOM();
        this.bindEvents();
        this.render();
    },

    cacheDOM() {
        this.formIngrediente = document.getElementById('form-ingrediente');
        this.listaIngredientes = document.getElementById('lista-ingredientes');
        this.selectIngrediente = document.getElementById('select-ingrediente');
        this.btnAgregarReceta = document.getElementById('btn-agregar-receta');
        this.listaReceta = document.getElementById('lista-receta');
        this.totalVasosInput = document.getElementById('total-vasos');
        this.margenGananciaSelect = document.getElementById('margen-ganancia');

        this.resBs = document.getElementById('resultado-bs');
        this.resUsd = document.getElementById('resultado-usd');
        this.costoProd = document.getElementById('costo-produccion');
        this.tasaValor = document.getElementById('tasa-valor');
        this.btnEditarTasa = document.getElementById('btn-editar-tasa');
        this.unidadIngredienteSelect = document.getElementById('unidad-ingrediente');
        this.unidadRecetaLabel = document.getElementById('unidad-receta-label');
    },

    bindEvents() {
        this.formIngrediente.addEventListener('submit', (e) => {
            e.preventDefault();
            this.agregarIngrediente();
        });

        this.btnAgregarReceta.addEventListener('click', () => {
            this.agregarALaReceta();
        });

        this.selectIngrediente.addEventListener('change', () => {
            const id = parseInt(this.selectIngrediente.value);
            const ing = this.ingredientes.find(i => i.id === id);
            this.unidadRecetaLabel.textContent = ing ? ing.unidad : 'g';
        });

        this.btnEditarTasa.addEventListener('click', () => {
            const nuevaTasa = prompt('Ingresa el precio del dólar hoy (Ej: 36.50):', this.tasaDolar);
            if (nuevaTasa && !isNaN(parseFloat(nuevaTasa))) {
                this.setTasa(parseFloat(nuevaTasa));
                localStorage.setItem('yogures_tasa_manual', nuevaTasa);
            }
        });

        this.totalVasosInput.addEventListener('input', () => this.calcularFinal());
        this.margenGananciaSelect.addEventListener('change', () => this.calcularFinal());
    },

    agregarIngrediente() {
        const nombre = document.getElementById('nombre-ingrediente').value;
        const precio = parseFloat(document.getElementById('precio-ingrediente').value);
        const cantidad = parseFloat(document.getElementById('cantidad-ingrediente').value);
        const unidad = this.unidadIngredienteSelect.value;

        const nuevo = {
            id: Date.now(),
            nombre,
            precio,
            cantidad,
            unidad,
            costoUnitario: Calculadora.calcularCostoUnitario(precio, cantidad)
        };

        this.ingredientes.push(nuevo);
        this.guardarDatos();
        this.render();
        this.formIngrediente.reset();
    },

    eliminarIngrediente(id) {
        this.ingredientes = this.ingredientes.filter(i => i.id !== id);
        // También eliminar de la receta si existía
        this.receta = this.receta.filter(r => r.ingredienteId !== id);
        this.guardarDatos();
        this.render();
    },

    agregarALaReceta() {
        const id = parseInt(this.selectIngrediente.value);
        const cantidadUsada = parseFloat(document.getElementById('uso-cantidad').value);

        if (!id || !cantidadUsada) return;

        const ingrediente = this.ingredientes.find(i => i.id === id);
        if (!ingrediente) return;

        const itemReceta = {
            ingredienteId: id,
            nombre: ingrediente.nombre,
            cantidadUsada,
            unidad: ingrediente.unidad,
            costoPorcion: Calculadora.calcularCostoPorcion(ingrediente.costoUnitario, cantidadUsada)
        };

        this.receta.push(itemReceta);
        this.guardarDatos();
        this.render();
        document.getElementById('uso-cantidad').value = '';
    },

    eliminarDeReceta(index) {
        this.receta.splice(index, 1);
        this.guardarDatos();
        this.render();
    },

    formatear(valor) {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor);
    },

    calcularFinal() {
        const costoProduccionTotal = this.receta.reduce((acc, curr) => acc + curr.costoPorcion, 0);
        const totalVasos = parseFloat(this.totalVasosInput.value) || 1;
        const margen = this.margenGananciaSelect.value;

        const costoPorVaso = costoProduccionTotal / totalVasos;
        const precioSugeridoBs = Calculadora.calcularPrecioSugerido(costoPorVaso, margen);
        const precioSugeridoUsd = Calculadora.bsADolar(precioSugeridoBs, this.tasaDolar);

        this.costoProd.textContent = this.formatear(costoProduccionTotal);
        this.resBs.textContent = this.formatear(precioSugeridoBs);
        this.resUsd.textContent = this.formatear(precioSugeridoUsd);
    },

    render() {
        // Renderizar Lista Ingredientes
        this.listaIngredientes.innerHTML = '';
        this.selectIngrediente.innerHTML = '<option value="">Selecciona un producto...</option>';

        this.ingredientes.forEach(ing => {
            const div = document.createElement('div');
            div.className = 'ingredient-item animate';
            div.innerHTML = `
                <div>
                    <strong>${ing.nombre}</strong><br>
                    <small>${this.formatear(ing.cantidad)} ${ing.unidad} por ${this.formatear(ing.precio)} Bs (Costo: ${this.formatear(ing.costoUnitario)} Bs/${ing.unidad})</small>
                </div>
                <button class="btn" style="background: #FFE5E5; color: #FF4D4D;" onclick="UI.eliminarIngrediente(${ing.id})">🗑️</button>
            `;
            this.listaIngredientes.appendChild(div);

            const opt = document.createElement('option');
            opt.value = ing.id;
            opt.textContent = ing.nombre;
            this.selectIngrediente.appendChild(opt);
        });

        // Renderizar Lista Receta
        this.listaReceta.innerHTML = '';
        this.receta.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'ingredient-item animate';
            div.innerHTML = `
                <div>
                    <strong>${item.nombre}</strong><br>
                    <small>Usando ${this.formatear(item.cantidadUsada)} ${item.unidad} = ${this.formatear(item.costoPorcion)} Bs</small>
                </div>
                <button class="btn" style="background: #FFE5E5; color: #FF4D4D;" onclick="UI.eliminarDeReceta(${index})">🗑️</button>
            `;
            this.listaReceta.appendChild(div);
        });

        this.calcularFinal();
    },

    guardarDatos() {
        localStorage.setItem('yogures_ingredientes', JSON.stringify(this.ingredientes));
        localStorage.setItem('yogures_receta', JSON.stringify(this.receta));
    },

    cargarDatos() {
        const ing = localStorage.getItem('yogures_ingredientes');
        const rec = localStorage.getItem('yogures_receta');
        const tasaManual = localStorage.getItem('yogures_tasa_manual');
        if (ing) this.ingredientes = JSON.parse(ing);
        if (rec) this.receta = JSON.parse(rec);
        if (tasaManual) this.tasaDolar = parseFloat(tasaManual);
    },

    setTasa(valor) {
        this.tasaDolar = valor;
        this.tasaValor.textContent = valor ? `${this.formatear(valor)} Bs/$` : 'Error al cargar';
        this.calcularFinal();
    }
};
