/**
 * Orquestador principal de la Interfaz de Usuario - YogurtBusiness Pro v2.2
 */
const UI = {
    // --- ESTADO ---
    ingredientes: [],
    receta: [],
    clientes: [],
    ventas: [],
    inventario: [],
    tasaDolar: 0,
    currentTab: 'calculadora',

    // Premium v3.0
    isPremium: false,
    sheetLink: '',

    // Paginación
    paginas: {
        ingredientes: 1,
        ventas: 1,
        inventario: 1,
        clientes: 1
    },

    // Control de Fechas
    fechaFoco: new Date(),
    fechaCalendario: new Date(),
    vistaGrafica: 'mes',

    chart: null,

    // --- INICIALIZACIÓN ---
    init() {
        this.cargarDatos();
        this.cacheDOM();
        this.bindEvents();
        this.verificarOnboarding();
        this.render();
        this.inicializarGrafica();
    },

    cacheDOM() {
        this.mainNav = document.querySelector('.main-nav');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.storageAlert = document.getElementById('storage-alert');
        this.subtitulo = document.getElementById('subtitulo-negocio');

        // Calculadora
        this.formIngrediente = document.getElementById('form-ingrediente');
        this.listaIngredientes = document.getElementById('lista-ingredientes');
        this.selectIngrediente = document.getElementById('select-ingrediente');
        this.btnAgregarReceta = document.getElementById('btn-agregar-receta');
        this.listaReceta = document.getElementById('lista-receta');
        this.totalVasosInput = document.getElementById('total-vasos');
        this.margenGananciaSelect = document.getElementById('margen-ganancia');
        this.btnInvModal = document.getElementById('btn-añadir-inventario');
        this.unidadRecetaLabel = document.getElementById('unidad-receta-label');
        this.calcInversion = document.getElementById('calc-inversion');
        this.calcGanancia = document.getElementById('calc-ganancia');

        // Resultados Calc
        this.resBs = document.getElementById('resultado-bs');
        this.resUsd = document.getElementById('resultado-usd');
        this.tasaValor = document.getElementById('tasa-valor');
        this.btnEditarTasa = document.getElementById('btn-editar-tasa');

        // Dashboard
        this.dashVentas = document.getElementById('dash-ventas-totales');
        this.dashDeudas = document.getElementById('dash-por-cobrar');
        this.labelPeriodo = document.getElementById('label-periodo');
        this.btnChartPrev = document.getElementById('btn-chart-prev');
        this.btnChartNext = document.getElementById('btn-chart-next');
        this.selectVista = document.getElementById('select-chart-vista');
        this.listaVentas = document.getElementById('ultimas-ventas');

        // Inventario
        this.listaInventario = document.getElementById('lista-inventario');
        this.invValorTotal = document.getElementById('inv-valor-total');
        this.invGananciaTotal = document.getElementById('inv-ganancia-total');

        // Calendario
        this.calGrid = document.getElementById('calendario-grid');
        this.labelMesCal = document.getElementById('label-mes-calendario');
        this.listaDeudasDia = document.getElementById('deudas-dia-seleccionado');

        // Clientes
        this.formCliente = document.getElementById('form-cliente');
        this.listaClientes = document.getElementById('lista-clientes');

        // Modales
        this.modalOnboarding = document.getElementById('modal-onboarding');
        this.modalInventario = document.getElementById('modal-inventario');
        this.modalVenta = document.getElementById('modal-venta');
        this.modalRespaldo = document.getElementById('modal-respaldo');
        this.modalClienteRapido = document.getElementById('modal-cliente-rapido');
        this.modalCobro = document.getElementById('modal-cobro');
        this.btnConfirmarCobro = document.getElementById('btn-confirmar-cobro');
    },

    bindEvents() {
        this.mainNav.onclick = (e) => {
            const btn = e.target.closest('.nav-btn');
            if (btn) this.cambiarTab(btn.dataset.tab);
        };

        this.formIngrediente.onsubmit = (e) => {
            e.preventDefault();
            this.agregarIngrediente();
        };

        this.btnAgregarReceta.onclick = () => this.agregarALaReceta();

        this.selectIngrediente.onchange = () => {
            const id = parseInt(this.selectIngrediente.value);
            const ing = this.ingredientes.find(i => i.id === id);
            this.unidadRecetaLabel.textContent = ing ? ing.unidad : 'g';
        };

        this.totalVasosInput.oninput = () => this.calcularFinal();
        this.margenGananciaSelect.onchange = () => this.calcularFinal();
        this.btnInvModal.onclick = () => this.abrirModalInventario();

        // Gráficas
        this.btnChartPrev.onclick = () => this.navegarPeriodo(-1);
        this.btnChartNext.onclick = () => this.navegarPeriodo(1);
        this.selectVista.onchange = () => {
            this.vistaGrafica = this.selectVista.value;
            this.actualizarDashboard();
        };
        document.getElementById('btn-nueva-venta-dash').onclick = () => this.abrirModalVenta();

        // Calendario
        document.getElementById('btn-cal-prev').onclick = () => this.navegarCalendario(-1);
        document.getElementById('btn-cal-next').onclick = () => this.navegarCalendario(1);

        // Clientes
        this.formCliente.onsubmit = (e) => {
            e.preventDefault();
            this.agregarCliente();
        };

        // Modales Forms
        document.getElementById('form-guardar-inventario').onsubmit = (e) => {
            e.preventDefault();
            this.guardarEnInventario();
        };
        document.getElementById('form-venta').onsubmit = (e) => {
            e.preventDefault();
            this.registrarVenta();
        };
        document.getElementById('form-cliente-rapido').onsubmit = (e) => {
            e.preventDefault();
            this.agregarClienteRapido();
        };
        document.getElementById('form-onboarding').onsubmit = (e) => {
            e.preventDefault();
            this.finalizarOnboarding();
        };

        this.btnEditarTasa.onclick = () => this.editarTasaManual();
        this.btnConfirmarCobro.onclick = () => this.ejecutarCobro();

        // Respaldo
        document.getElementById('btn-ver-respaldo').onclick = () => this.abrirModal('modal-respaldo');

        document.getElementById('venta-tipo').onchange = (e) => {
            document.getElementById('group-fecha-cobro').style.display = e.target.value === 'credito' ? 'block' : 'none';
        };

        // Activación Premium v3.0
        document.getElementById('btn-activar-nube').onclick = () => this.activarPremium();
    },

    // --- SISTEMA DE TABS ---
    cambiarTab(tabId) {
        this.currentTab = tabId;
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        this.tabContents.forEach(content => content.classList.toggle('active', content.id === `tab-${tabId}`));
        if (tabId === 'dashboard') this.actualizarDashboard();
        if (tabId === 'calendario') this.renderCalendario();
        this.render();
    },

    // --- ONBOARDING ---
    verificarOnboarding() {
        if (!localStorage.getItem('yogures_onboarding')) {
            this.modalOnboarding.style.display = 'flex';
        } else {
            this.storageAlert.style.display = 'flex';
            const subtitulo = document.getElementById('subtitulo-negocio');
            if (subtitulo) subtitulo.textContent = `Negocio: ${localStorage.getItem('yogures_nombre_negocio')}`;
        }
    },
    finalizarOnboarding() {
        const n = document.getElementById('on-nombre-negocio').value;
        const d = document.getElementById('on-nombre-dueña').value;
        localStorage.setItem('yogures_nombre_negocio', n);
        localStorage.setItem('yogures_dueña', d);
        localStorage.setItem('yogures_onboarding', 'true');
        this.cerrarModal('modal-onboarding');
        this.verificarOnboarding();
        // AUTO-OPEN RESPALDO v2.7 PRO
        setTimeout(() => this.abrirModal('modal-respaldo'), 600);
    },

    // --- LÓGICA CALCULADORA ---
    agregarIngrediente() {
        const nombre = document.getElementById('nombre-ingrediente').value;
        const precio = parseFloat(document.getElementById('precio-ingrediente').value);
        const cantidad = parseFloat(document.getElementById('cantidad-ingrediente').value);
        const unidad = document.getElementById('unidad-ingrediente').value;

        this.ingredientes.push({
            id: Date.now(),
            nombre, precio, cantidad, unidad,
            stockRestante: cantidad,
            costoUnitario: Calculadora.calcularCostoUnitario(precio, cantidad)
        });

        this.guardarDatos();
        this.render();
        this.formIngrediente.reset();
    },

    agregarALaReceta() {
        const id = parseInt(this.selectIngrediente.value);
        const uso = parseFloat(document.getElementById('uso-cantidad').value);
        if (!id || !uso) return;

        const ing = this.ingredientes.find(i => i.id === id);
        if (uso > (ing.stockRestante || 0)) return alert(`Stock insuficiente de ${ing.nombre}.`);

        ing.stockRestante -= uso;

        this.receta.push({
            id: Date.now(),
            ingredienteId: id,
            nombre: ing.nombre,
            cantidadUsada: uso,
            unidad: ing.unidad,
            costoPorcion: Calculadora.calcularCostoPorcion(ing.costoUnitario, uso)
        });

        this.guardarDatos();
        this.render();
        document.getElementById('uso-cantidad').value = '';
    },

    eliminarDeReceta(idx) {
        const it = this.receta[idx];
        const ing = this.ingredientes.find(i => i.id === it.ingredienteId);
        if (ing) ing.stockRestante += it.cantidadUsada;

        this.receta.splice(idx, 1);
        this.guardarDatos();
        this.render();
    },

    calcularFinal() {
        const costoProduccionTotal = this.receta.reduce((acc, curr) => acc + curr.costoPorcion, 0);
        const totalVasos = parseFloat(this.totalVasosInput.value) || 1;
        const margen = parseFloat(this.margenGananciaSelect.value);

        const costoPorVasoBS = costoProduccionTotal / totalVasos;
        const precioSugeridoBs = Calculadora.calcularPrecioSugerido(costoPorVasoBS, margen);
        const precioSugeridoUsd = Calculadora.bsADolar(precioSugeridoBs, this.tasaDolar);

        const inversionUsd = Calculadora.bsADolar(costoProduccionTotal, this.tasaDolar);
        const gananciaUsd = (precioSugeridoUsd * totalVasos) - inversionUsd;

        this.resBs.textContent = CRMLogic.formatearBs(precioSugeridoBs);
        this.resUsd.textContent = CRMLogic.formatearUsd(precioSugeridoUsd);
        this.calcInversion.textContent = `${CRMLogic.formatearUsd(inversionUsd)} $`;
        this.calcGanancia.textContent = `${CRMLogic.formatearUsd(gananciaUsd)} $`;
    },

    // --- INVENTARIO ---
    abrirModalInventario() {
        const cant = parseFloat(this.totalVasosInput.value) || 0;
        const pvpUsd = parseFloat(this.resUsd.textContent.replace(',', '.'));
        if (cant <= 0) return alert('Debes producir al menos 1 vaso.');

        document.getElementById('inv-cantidad').value = cant;
        document.getElementById('inv-precio').value = pvpUsd;
        this.modalInventario.style.display = 'flex';
    },

    guardarEnInventario() {
        const nombre = document.getElementById('inv-nombre').value;
        const cantidad = parseInt(document.getElementById('inv-cantidad').value);
        const precioUsd = parseFloat(document.getElementById('inv-precio').value);

        const costoProduccionTotal = this.receta.reduce((acc, curr) => acc + curr.costoPorcion, 0);
        const costoUnitarioUsd = Calculadora.bsADolar(costoProduccionTotal / cantidad, this.tasaDolar);

        this.inventario.push({
            id: Date.now(),
            nombre,
            stock: cantidad,
            precioUsd,
            costoUnitarioUsd: costoUnitarioUsd || 0
        });

        this.receta = [];
        this.guardarDatos();
        this.cerrarModal('modal-inventario');
        this.cambiarTab('inventario');
    },

    actualizarMetricasInventario() {
        const totalValor = this.inventario.reduce((acc, p) => acc + (p.stock * (p.precioUsd || 0)), 0);
        const totalGanancia = this.inventario.reduce((acc, p) => acc + (p.stock * ((p.precioUsd || 0) - (p.costoUnitarioUsd || 0))), 0);

        this.invValorTotal.textContent = `${CRMLogic.formatearUsd(totalValor)} $`;
        this.invGananciaTotal.textContent = `${CRMLogic.formatearUsd(totalGanancia)} $`;
    },

    // --- VENTAS ---
    abrirModalVenta() {
        if (!this.inventario.length) return alert('No hay stock en nevera.');

        this.actualizarSelectoresVenta();
        this.modalVenta.style.display = 'flex';
    },

    actualizarSelectoresVenta() {
        const selC = document.getElementById('venta-cliente');
        const selP = document.getElementById('venta-producto');
        const inputCant = document.getElementById('venta-cantidad');

        selC.innerHTML = this.clientes.length
            ? this.clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('')
            : '<option value="">(Sin clientes registrados)</option>';

        selP.innerHTML = this.inventario.map(p => `<option value="${p.id}">${p.nombre} (${p.stock})</option>`).join('');

        // Validación stock v2.5
        const actualizarMax = () => {
            const prod = this.inventario.find(p => p.id === parseInt(selP.value));
            if (prod) inputCant.max = prod.stock;
        };
        selP.onchange = actualizarMax;
        actualizarMax();

        // Limpiar fecha cobro
        document.getElementById('venta-fecha-cobro').value = '';
        document.getElementById('group-fecha-cobro').style.display = 'none';
        document.getElementById('venta-tipo').value = 'contado';
    },

    agregarCliente() {
        const nombre = document.getElementById('nombre-cliente').value;
        const tel = document.getElementById('tel-cliente').value;

        if (!nombre || !tel) return alert('Por favor, completa nombre y teléfono.');

        const nuevo = {
            id: Date.now(),
            nombre,
            tel
        };

        this.clientes.push(nuevo);
        this.guardarDatos();
        this.render();
        document.getElementById('form-cliente').reset();
        alert('✅ Cliente guardado con éxito.');
    },

    agregarClienteRapido() {
        const nombre = document.getElementById('rapido-nombre').value;
        const tel = document.getElementById('rapido-tel').value;

        if (!nombre) return alert('El nombre es obligatorio.');

        const nuevo = { id: Date.now(), nombre, tel: tel || '0000000000' };
        this.clientes.push(nuevo);
        this.guardarDatos();
        this.actualizarSelectoresVenta();
        document.getElementById('venta-cliente').value = nuevo.id;
        this.cerrarModal('modal-cliente-rapido');
        document.getElementById('form-cliente-rapido').reset();
    },

    registrarVenta() {
        const cId = parseInt(document.getElementById('venta-cliente').value);
        const pId = parseInt(document.getElementById('venta-producto').value);
        const cant = parseInt(document.getElementById('venta-cantidad').value);
        const tipo = document.getElementById('venta-tipo').value;

        const prod = this.inventario.find(p => p.id === pId);
        if (cant > prod.stock) return alert('No hay suficiente stock.');

        const totalUsd = prod.precioUsd * cant;
        const pagoFull = (tipo === 'contado');
        let fechaCobro = null;

        if (!pagoFull) {
            const fechaManual = document.getElementById('venta-fecha-cobro').value;
            fechaCobro = fechaManual ? new Date(fechaManual).toISOString() : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
        }

        this.ventas.push({
            id: Date.now(),
            clienteId: cId,
            clienteNombre: this.clientes.find(c => c.id === cId).nombre,
            productoNombre: prod.nombre,
            cantidad: cant,
            totalUsd,
            fecha: new Date().toISOString(),
            pagoRealizado: pagoFull ? totalUsd : 0,
            fechaCobro: fechaCobro
        });

        prod.stock -= cant;
        if (prod.stock <= 0) this.inventario = this.inventario.filter(p => p.id !== pId);

        this.guardarDatos();
        this.cerrarModal('modal-venta');
        this.actualizarDashboard();
    },

    // --- GRÁFICAS ---
    inicializarGrafica() {
        const ctx = document.getElementById('chart-ventas').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: '📦 Contado', data: [], borderColor: '#2ECC71', backgroundColor: 'rgba(46,204,113,0.1)', fill: true, tension: 0.3 },
                    { label: '💳 Crédito', data: [], borderColor: '#FF6B6B', backgroundColor: 'rgba(255,107,107,0.1)', fill: true, tension: 0.3 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, min: 0 } }
            }
        });
        this.actualizarDashboard();
    },

    actualizarDashboard() {
        const mes = this.fechaFoco.getMonth();
        const año = this.fechaFoco.getFullYear();
        const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        let data;
        if (this.vistaGrafica === 'mes') {
            this.labelPeriodo.textContent = `${nombresMeses[mes]} ${año}`;
            data = CRMLogic.agruparVentasDualesPorMes(this.ventas, mes, año);
        } else {
            this.labelPeriodo.textContent = `Año ${año}`;
            data = CRMLogic.agruparVentasDualesPorAño(this.ventas, año);
        }

        this.chart.data.labels = data.etiquetas;
        this.chart.data.datasets[0].data = data.contado;
        this.chart.data.datasets[1].data = data.credito;
        this.chart.update();

        const ventTot = data.contado.reduce((a, b) => a + b, 0) + data.credito.reduce((a, b) => a + b, 0);
        const deuTot = this.ventas.reduce((acc, v) => {
            const f = new Date(v.fecha);
            const m = this.vistaGrafica === 'mes' ? (f.getMonth() === mes && f.getFullYear() === año) : (f.getFullYear() === año);
            return m ? acc + (v.totalUsd - v.pagoRealizado) : acc;
        }, 0);

        this.dashVentas.textContent = `${CRMLogic.formatearUsd(ventTot)} $`;
        this.dashDeudas.textContent = `${CRMLogic.formatearUsd(deuTot)} $`;
        this.renderListaPaginada('ventas', this.ventas, this.listaVentas, 'pag-ventas');
    },

    // --- RENDERING ---
    render() {
        if (this.currentTab === 'calculadora') {
            this.renderListaPaginada('ingredientes', this.ingredientes, this.listaIngredientes, 'pag-ingredientes');
            this.renderListaReceta();
            this.calcularFinal();
        }
        if (this.currentTab === 'inventario') {
            this.renderListaPaginada('inventario', this.inventario, this.listaInventario, 'pag-inventario');
            this.actualizarMetricasInventario();
        }
        if (this.currentTab === 'clientes') {
            this.renderListaPaginada('clientes', this.clientes, this.listaClientes, 'pag-clientes');
        }
    },

    renderListaPaginada(clave, lista, contenedor, contPag) {
        const pag = CRMLogic.obtenerPagina([...lista].reverse(), this.paginas[clave]);
        contenedor.innerHTML = pag.items.length ? '' : '<p class="text-center" style="padding:20px; color:#999;">Vacío.</p>';

        pag.items.forEach(it => {
            const div = document.createElement('div');
            if (clave === 'ingredientes') {
                div.className = 'ingredient-item animate';
                const sR = it.stockRestante ?? it.cantidad;
                const unidad = it.unidad || 'g';
                const low = sR < (it.cantidad * 0.2);
                div.innerHTML = `<div><b>${it.nombre}</b><br><small>${CRMLogic.formatearBs(it.precio)} Bs / ${it.cantidad}${unidad}</small></div>
                    <div style="text-align:right"><span class="stock-badge ${low ? 'low' : ''}">Quedan: ${sR}${unidad}</span><br>
                    <button onclick="UI.eliminarIngrediente(${it.id})" class="icon-btn">🗑️</button></div>`;
            } else if (clave === 'inventario') {
                div.className = 'inventory-item animate';
                div.innerHTML = `<div><b>${it.nombre}</b><br><small>${it.stock} vasos · $${CRMLogic.formatearUsd(it.precioUsd)}/u</small></div>
                    <button onclick="UI.eliminarInventario(${it.id})" class="icon-btn">🗑️</button>`;
            } else if (clave === 'ventas') {
                const pagada = it.pagoRealizado >= it.totalUsd;
                div.className = 'ingredient-item animate';
                div.innerHTML = `<div><b>${it.clienteNombre}</b> <span class="badge ${pagada ? 'paid' : 'debt'}">${pagada ? 'Pagada' : 'Deuda'}</span><br>
                    <small>${it.productoNombre} (x${it.cantidad})</small></div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="font-weight:700">$${CRMLogic.formatearUsd(it.totalUsd)}</div>
                        <button onclick="UI.eliminarVenta(${it.id})" class="icon-btn">🗑️</button>
                    </div>`;
            } else if (clave === 'clientes') {
                const comprasTot = this.ventas.filter(v => v.clienteId === it.id).reduce((a, b) => a + b.totalUsd, 0);
                const deudaTot = this.ventas.filter(v => v.clienteId === it.id).reduce((a, b) => a + (b.totalUsd - b.pagoRealizado), 0);
                div.className = 'ingredient-item animate';
                div.innerHTML = `<div><b>${it.nombre}</b><br><small>Total: $${CRMLogic.formatearUsd(comprasTot)} · Deuda: $${CRMLogic.formatearUsd(deudaTot)}</small></div>
                    <div style="display:flex; gap:10px">
                        <a href="https://wa.me/58${CRMLogic.sanitizarWhatsApp(it.tel)}" target="_blank" class="whatsapp-small"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"></a>
                        <button onclick="UI.eliminarCliente(${it.id})" class="icon-btn">🗑️</button>
                    </div>`;
            }
            contenedor.appendChild(div);
        });
        this.renderControlesPag(clave, pag.totalPaginas, contPag);
    },

    renderControlesPag(clave, total, contenedorId) {
        const cont = document.getElementById(contenedorId);
        if (total <= 1) { cont.innerHTML = ''; return; }
        cont.innerHTML = `
            <button class="pag-btn" ${this.paginas[clave] === 1 ? 'disabled' : ''} onclick="UI.irPagina('${clave}', ${this.paginas[clave] - 1})">◀️</button>
            <span style="font-size:0.75rem; font-weight:700">Pág ${this.paginas[clave]}/${total}</span>
            <button class="pag-btn" ${this.paginas[clave] === total ? 'disabled' : ''} onclick="UI.irPagina('${clave}', ${this.paginas[clave] + 1})">▶️</button>
        `;
    },

    irPagina(clave, p) { this.paginas[clave] = p; this.render(); if (clave === 'ventas') this.actualizarDashboard(); },

    renderListaReceta() {
        this.listaReceta.innerHTML = this.receta.length ? '' : '<p style="padding:10px; color:#BBB; font-size:14px;">Mezcla vacía.</p>';
        this.receta.forEach((it, idx) => {
            const div = document.createElement('div');
            div.className = 'ingredient-item';
            div.innerHTML = `<div><b>${it.nombre}</b><br><small>${it.cantidadUsada}${it.unidad} = ${CRMLogic.formatearBs(it.costoPorcion)} Bs</small></div>
                            <button onclick="UI.eliminarDeReceta(${idx})" class="icon-btn">🗑️</button>`;
            this.listaReceta.appendChild(div);
        });
        this.selectIngrediente.innerHTML = '<option value="">Selección...</option>' +
            this.ingredientes.map(i => `<option value="${i.id}">${i.nombre} (${i.stockRestante ?? i.cantidad}${i.unidad})</option>`).join('');
    },

    // --- CALENDARIO ---
    renderCalendario() {
        const mes = this.fechaCalendario.getMonth();
        const año = this.fechaCalendario.getFullYear();
        const nombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.labelMesCal.textContent = `${nombres[mes]} ${año}`;
        this.calGrid.innerHTML = '<div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>';

        CalendarLogic.obtenerDatosMes(mes, año).forEach(d => {
            const div = document.createElement('div');
            div.className = 'calendar-day';
            if (d.dia) {
                div.textContent = d.dia;
                const deudas = CalendarLogic.obtenerDeudasPorFecha(this.ventas, d.fecha);
                if (deudas.length) div.classList.add('has-debt');
                div.onclick = () => this.mostrarDeudasDia(d.fecha, div);
            } else div.classList.add('empty');
            this.calGrid.appendChild(div);
        });
    },

    mostrarDeudasDia(fecha, el) {
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        el.classList.add('selected');
        const deudas = CalendarLogic.obtenerDeudasPorFecha(this.ventas, fecha);
        this.listaDeudasDia.innerHTML = deudas.length ? `<h3>Cobros ${fecha}</h3>` : '<p>Sin cobros.</p>';
        deudas.forEach(v => {
            const cliente = this.clientes.find(c => c.id === v.clienteId);
            const montoDeuda = v.totalUsd - v.pagoRealizado;
            const div = document.createElement('div');
            div.className = 'debt-item animate';
            div.innerHTML = `
                <div style="flex:1"><b>${v.clienteNombre}</b><br><small>$${CRMLogic.formatearUsd(montoDeuda)}</small></div>
                <div style="display:flex; gap:5px">
                    <button onclick="UI.prepararCobro(${v.id})" class="whatsapp-small" style="background:var(--fresa-suave); color:var(--fresa); border:none; cursor:pointer;">💵 Cobrar</button>
                    <a href="https://wa.me/58${CRMLogic.sanitizarWhatsApp(cliente.tel)}?text=${CRMLogic.generarMensajeCobro(cliente, montoDeuda, this.tasaDolar)}" 
                       target="_blank" class="whatsapp-small"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"> WA</a>
                </div>
            `;
            this.listaDeudasDia.appendChild(div);
        });
    },

    // --- UTILIDADES ---
    navegarPeriodo(dir) {
        if (this.vistaGrafica === 'mes') this.fechaFoco.setMonth(this.fechaFoco.getMonth() + dir);
        else this.fechaFoco.setFullYear(this.fechaFoco.getFullYear() + dir);
        this.actualizarDashboard();
    },
    navegarCalendario(dir) { this.fechaCalendario.setMonth(this.fechaCalendario.getMonth() + dir); this.renderCalendario(); },
    abrirModal(id) { document.getElementById(id).style.display = 'flex'; },
    cerrarModal(id) { document.getElementById(id).style.display = 'none'; },

    editarTasaManual() {
        const v = prompt('Tasa BCV:', this.tasaDolar);
        if (v && !isNaN(v)) { this.setTasa(parseFloat(v)); localStorage.setItem('yogures_tasa_manual', v); }
    },
    setTasa(v) {
        this.tasaDolar = v;
        const el = document.getElementById('tasa-valor');
        if (el) el.textContent = `${CRMLogic.formatearBs(v)} Bs/$`;
        this.calcularFinal();
    },

    // --- LÓGICA PREMIUM v3.0 ---
    async activarPremium() {
        const link = document.getElementById('input-link-nube').value;
        if (!link) return alert("Por favor, pega el link de tu hoja de cálculo.");

        const btn = document.getElementById('btn-activar-nube');
        const originalText = btn.textContent;
        btn.textContent = "⌛ Verificando...";
        btn.disabled = true;

        const res = await SheetsService.validarAcceso(link);

        btn.disabled = false;
        btn.textContent = originalText;

        if (res.status === 200 || res.status === 302) { // 302 es por los redirects de Google
            this.isPremium = true;
            this.sheetLink = link;
            this.guardarDatos();
            this.actualizarUIRespaldo();
            alert("🚀 ¡YogurtBusiness Pro PREMIUM ACTIVADO! Tus datos ahora se respaldan en la nube.");
        } else {
            alert(res.message || "No se pudo activar. Asegúrate de que el administrador te ha dado permiso.");
        }
    },

    actualizarUIRespaldo() {
        const badge = document.getElementById('status-nube');
        const form = document.getElementById('premium-form');
        if (this.isPremium) {
            if (badge) badge.style.display = 'block';
            if (form) form.style.display = 'none';
            document.querySelector('.alert-info').innerHTML = "✨ <b>Tus datos están seguros</b>. Se sincronizan automáticamente con Google Sheets.";
        }
    },

    async sincronizarConNube() {
        if (!this.isPremium || !this.sheetLink) return;

        const fullData = {
            ingredientes: this.ingredientes,
            receta: this.receta,
            clientes: this.clientes,
            ventas: this.ventas,
            inventario: this.inventario,
            tasaDolar: this.tasaDolar,
            config: {
                negocio: localStorage.getItem('yogures_nombre_negocio'),
                dueña: localStorage.getItem('yogures_dueña')
            }
        };

        await SheetsService.sincronizarTodo(this.sheetLink, fullData);
    },

    guardarDatos() {
        localStorage.setItem('yogures_ingredientes', JSON.stringify(this.ingredientes));
        localStorage.setItem('yogures_receta', JSON.stringify(this.receta));
        localStorage.setItem('yogures_clientes', JSON.stringify(this.clientes));
        localStorage.setItem('yogures_ventas', JSON.stringify(this.ventas));
        localStorage.setItem('yogures_inventario', JSON.stringify(this.inventario));
        // Guardar estado Premium
        localStorage.setItem('yogures_premium', this.isPremium);
        localStorage.setItem('yogures_sheet_link', this.sheetLink);

        // Disparar sincronización silenciosa si es Premium
        this.sincronizarConNube();
    },

    cargarDatos() {
        this.ingredientes = JSON.parse(localStorage.getItem('yogures_ingredientes') || '[]');
        this.receta = JSON.parse(localStorage.getItem('yogures_receta') || '[]');
        this.clientes = JSON.parse(localStorage.getItem('yogures_clientes') || '[]');
        this.ventas = JSON.parse(localStorage.getItem('yogures_ventas') || '[]');
        this.inventario = JSON.parse(localStorage.getItem('yogures_inventario') || '[]');
        this.tasaDolar = parseFloat(localStorage.getItem('yogures_tasa_manual') || '393.22');

        // Cargar estado Premium
        this.isPremium = localStorage.getItem('yogures_premium') === 'true';
        this.sheetLink = localStorage.getItem('yogures_sheet_link') || '';

        setTimeout(() => this.actualizarUIRespaldo(), 500); // Dar tiempo al DOM
    },

    eliminarIngrediente(id) { this.ingredientes = this.ingredientes.filter(i => i.id !== id); this.guardarDatos(); this.render(); },
    eliminarCliente(id) { this.clientes = this.clientes.filter(c => c.id !== id); this.guardarDatos(); this.render(); },
    eliminarInventario(id) { this.inventario = this.inventario.filter(p => p.id !== id); this.guardarDatos(); this.render(); },
    eliminarVenta(id) {
        this.ventas = this.ventas.filter(v => v.id !== id);
        this.guardarDatos();
        this.actualizarDashboard();
    },

    mostrarAyuda(seccion) {
        const mensajes = {
            'insumos': "Aquí debes anotar todo lo que compras para hacer tus yogures. Por ejemplo: Leche, Azúcar, Frutas o los Vasos. ¡No olvides poner cuánto te costó!",
            'mezcla': "En esta parte, elige qué ingredientes vas a usar hoy para preparar tus yogures. El sistema te dirá cuánto invertiste y a cómo debes vender cada vaso para ganar dinero.",
            'inventario': "Esta es tu 'Nevera Virtual'. Aquí verás cuántos yogures tienes listos para vender y cuánto dinero esperas ganar con ellos.",
            'agenda': "Aquí verás a quién debes cobrarle y cuándo. Los días con un círculo rojo significan que tienes cobros pendientes. ¡Toca el día para ver a quién cobrar!",
            'clientes': "Aquí guarda los nombres y teléfonos de las personas que te compran. Así podrás enviarles mensajes por WhatsApp fácilmente."
        };
        alert(mensajes[seccion] || "¡Estamos aquí para ayudarte a crecer tu negocio!");
    },

    prepararCobro(ventaId) {
        this.cobroPendienteId = ventaId;
        const v = this.ventas.find(x => x.id === ventaId);
        document.getElementById('cobro-cliente').textContent = v.clienteNombre;
        document.getElementById('cobro-monto').textContent = `$${CRMLogic.formatearUsd(v.totalUsd - v.pagoRealizado)}`;
        this.abrirModal('modal-cobro');
    },

    ejecutarCobro() {
        const v = this.ventas.find(x => x.id === this.cobroPendienteId);
        if (v) {
            v.pagoRealizado = v.totalUsd;
            v.fechaCobro = null;
            this.guardarDatos();
            this.cerrarModal('modal-cobro');
            this.actualizarDashboard();
            this.render();
            if (this.currentTab === 'calendario') this.renderCalendario();
            alert('¡Pago registrado con éxito!');
        }
    }
};
