// Dashboard UX & CaféU · Prototipo v2 · 12 Tarjetas (IHC-A-01 a IHC-A-12)
// Incluye:
//  - Flujo principal Dashboard UX (Sesión P-07 · IHC-A-07 a IHC-A-12 integradas)
//  - Catálogo interactivo y simuladores funcionales en vivo para las 12 tarjetas (IHC-A-01 a IHC-A-12)
//  - Verificación de integridad FNV-1a (huella() + estaVerificada()) en Inicio y Confirmación
'use strict';

const CLAVE = 'dux12.v2.sesion';
const params = new URLSearchParams(location.search);
const SIMULAR_FALLO = params.get('fallo') === '1';

// ---------- Catálogo Oficial de las 12 Tarjetas e Incidencias Sorpresa ----------
const TARJETAS_12 = [
  {
    codigo: 'IHC-A-01',
    caso: 'CafeU',
    titulo: 'Precio cambia al editar',
    persona: 'Estudiante con 10 min entre clases que edita cantidades en su pedido',
    tarea: 'Modificar de 1 a 2 cafés y verificar actualización del total antes de confirmar',
    evento: 'Tras modificar de 1 a 2 cafés, la pantalla conserva USD 4,25 aunque el total real cambia.',
    cambio: 'Implementar actualización de subtotales y total, identificar diferencia (+USD 2,50 → USD 6,75) y pedir nueva revisión antes de confirmar.',
    evidencias: 'Nuevo requisito R7, user flow corregido, captura del total y test de edición.',
    pregunta: '¿Qué parte de la rama de editar del user flow se modifica?',
    respuesta: 'Al editar la cantidad se invalida la revisión previa y se inserta el nodo de decisión "¿Total recalculado y revisado?". No se permite confirmar hasta que el usuario revise la diferencia (+USD 2,50) y apruebe el nuevo total (USD 6,75).'
  },
  {
    codigo: 'IHC-A-02',
    caso: 'CafeU',
    titulo: 'Quitar con teclado',
    persona: 'Usuario que opera el carrito exclusivamente con teclado (Tab / Enter)',
    tarea: 'Eliminar un producto con teclado sin perder el foco y poder deshacer',
    evento: 'La persona pulsa Quitar con teclado y el foco desaparece; no sabe qué se eliminó.',
    cambio: 'Anunciar producto eliminado (aria-live), devolver foco a control pertinente (botón Deshacer) y permitir Deshacer simulado.',
    evidencias: 'Secuencia Tab/Enter, prueba sin ratón, commit y wireframe ajustado.',
    pregunta: 'Demuestre edición, eliminación y confirmación sin usar el ratón.',
    respuesta: 'Con Tab se enfoca "Quitar producto" y se pulsa Enter. El lector anuncia el ítem eliminado, el foco salta automáticamente al botón "Deshacer eliminación" (Enter lo restaura) o con Tab pasa directamente a "Confirmar pedido".'
  },
  {
    codigo: 'IHC-A-03',
    caso: 'CafeU',
    titulo: 'Estado de pedido pendiente',
    persona: 'Estudiante en hora pico cuya red tarda 8 segundos al confirmar',
    tarea: 'Confirmar pedido sin generar cobros ni órdenes duplicadas por doble clic',
    evento: 'La aplicación tarda ocho segundos tras confirmar; el usuario vuelve a pulsar el botón.',
    cambio: 'Deshabilitar repetición, mostrar estado pendiente (8 s) y resolverlo a confirmado o no confirmado sin duplicar.',
    evidencias: 'Tres estados (Normal, Pendiente 8 s, Confirmado/No confirmado), prueba de doble clic, Issue y commit.',
    pregunta: '¿Cómo evita confundir clic efectuado con pedido confirmado?',
    respuesta: 'Al hacer clic el botón pasa a disabled con aria-busy="true" y muestra el banner azul "Estado: Pendiente de confirmación (8 s)… Clics adicionales bloqueados". Solo al recibir respuesta verificada cambia a verde "✓ Pedido confirmado".'
  },
  {
    codigo: 'IHC-A-04',
    caso: 'CafeU',
    titulo: 'Alergia añadida',
    persona: 'Estudiante con alergia alimentaria que revisa su bebida antes del pago',
    tarea: 'Detectar alérgeno añadido y corregir ingrediente sin vaciar el carrito',
    evento: 'El producto seleccionado ahora contiene un alérgeno no visible en el detalle.',
    cambio: 'Mostrar ingrediente/alerta antes de confirmar y ofrecer volver al detalle sin vaciar carrito.',
    evidencias: 'Captura de alerta, rama de editar en flujo, prueba de comprensión.',
    pregunta: '¿Cómo prueba que el usuario comprende y puede corregir su elección?',
    respuesta: 'Se presenta un aviso role="alert" con el ingrediente alérgeno detectado y un botón "Volver al detalle y sustituir (conservar carrito)" que permite cambiar a leche vegetal manteniendo los demás productos intactos.'
  },
  {
    codigo: 'IHC-A-05',
    caso: 'CafeU',
    titulo: 'Presupuesto agotado',
    persona: 'Estudiante con presupuesto límite de USD 5,00',
    tarea: 'Gestionar un incremento imprevisto de USD 0,50 ajustando cantidades o cancelando',
    evento: 'El precio del producto se incrementa USD 0,50 antes de confirmar.',
    cambio: 'Actualizar total, explicar el cambio (+USD 0,50) y permitir modificar cantidades o cancelar.',
    evidencias: 'Requisito R7, pantalla de desglose, prueba y commit.',
    pregunta: '¿Qué touchpoint pasa a ser momento de verdad y por qué?',
    respuesta: 'El touchpoint de "Revisión del desglose previo al pago" pasa a ser Momento de Verdad porque el incremento de USD 0,50 compromete el presupuesto del usuario; requiere transparencia inmediata y control para ajustar o cancelar sin fricción.'
  },
  {
    codigo: 'IHC-A-06',
    caso: 'CafeU',
    titulo: 'Falla de conexión',
    persona: 'Usuario en campus con corte de red justo al confirmar su pedido',
    tarea: 'Recuperarse de una caída de red sin perder datos ni recibir un falso éxito',
    evento: 'La red se interrumpe en el instante de confirmar y el sistema desconoce el resultado.',
    cambio: 'Mostrar no confirmado, reintento seguro y conservar datos; evitar afirmar éxito no verificado.',
    evidencias: 'Estados simulados, prueba de reintento, rama de error.',
    pregunta: '¿Cómo diferencia visualmente y semánticamente los tres estados?',
    respuesta: '1) Verificando: azul con spinner y aria-busy="true"; 2) No confirmado: rojo/ámbar con role="alert", icono ⚠ y botón de reintento idempotente conservando el carrito; 3) Confirmado: verde con role="status", icono ✓ y código verificado.'
  },
  {
    codigo: 'IHC-A-07',
    caso: 'Dashboard UX',
    titulo: 'Paso de checklist obligatorio',
    persona: 'Evaluador UX que debe cumplir una verificación previa antes de la Ejecución',
    tarea: 'Completar la verificación obligatoria en el Stepper antes de avanzar a Ejecución',
    evento: 'El docente añade una verificación obligatoria antes de entrar a Ejecución.',
    cambio: 'Actualizar Stepper, regla de avance secuencial, retroalimentación contextual y navegación de retorno.',
    evidencias: 'Nuevo requisito y trazabilidad, test funcional, commit.',
    pregunta: '¿Cómo aplica la visibilidad del estado del sistema de Nielsen?',
    respuesta: 'El Stepper muestra en todo momento qué pasos están "Completado", cuál es el "Actual" (aria-current="step") y cuáles están "Pendiente", bloqueando el salto a pasos posteriores sin completar el requisito previo y ofreciendo enlace de retorno.'
  },
  {
    codigo: 'IHC-A-08',
    caso: 'Dashboard UX',
    titulo: 'Guardado inconsistente',
    persona: 'Investigadora que alterna entre etapas y revisa el checklist de la sesión',
    tarea: 'Marcar 3 casillas, cambiar de etapa y volver sin perder el estado guardado',
    evento: 'El usuario marca tres casillas, cambia de etapa y vuelve: aparecen desmarcadas.',
    cambio: 'Conservar valores en localStorage, informar su estado de guardado (● Guardado HH:MM) y diferenciar pendiente/completo.',
    evidencias: 'Capturas antes/después, prueba de retorno, revisión de PR.',
    pregunta: '¿Qué evidencia muestra una mejora real frente a una mejora inferida?',
    respuesta: 'La mejora real se comprueba empíricamente al marcar 3 casillas, cambiar de etapa o recargar la página y verificar que el estado persiste ("3 de 4 obligatorios") junto con el indicador "● Guardado HH:MM", eliminando la recarga manual.'
  },
  {
    codigo: 'IHC-A-09',
    caso: 'Dashboard UX',
    titulo: 'Dato personal inesperado',
    persona: 'Moderador que registra datos de sesión cumpliendo anonimato de participantes',
    tarea: 'Garantizar que solo se almacene y resuma el código anónimo (P-07) sin nombres personales',
    evento: 'La interfaz ahora solicita el nombre completo de un participante y lo incluye en resumen.',
    cambio: 'Sustituir por código anónimo (P-07) y eliminar nombre del resumen sin perder métricas.',
    evidencias: 'Validación de anonimato, requisito de privacidad RNF-04, prueba y commit.',
    pregunta: '¿Qué requisito protege privacidad y dónde aparece en la trazabilidad?',
    respuesta: 'El requisito de privacidad y anonimización (RNF-04) sustituye cualquier nombre propio por el código anónimo P-07 tanto en el formulario de registro (#f-participante) como en el resumen final (renderCerrada()), conservando intactas las métricas.'
  },
  {
    codigo: 'IHC-A-10',
    caso: 'Dashboard UX',
    titulo: 'Stepper sin color',
    persona: 'Analista de accesibilidad que evalúa la interfaz en escala de grises y por teclado',
    tarea: 'Identificar el paso actual y completados sin depender del color',
    evento: 'El docente activa una visualización en escala de grises y elimina el color del estado activo.',
    cambio: 'Identificar estado por texto ("Completado", "Actual", "Pendiente"), símbolos (✓) y atributos semánticos (aria-current="step"); demostrar operación por teclado.',
    evidencias: 'Modo en grises activable, foco visible, narración del estado, commit.',
    pregunta: 'Demuestre cómo conoce el paso actual sin depender del color.',
    respuesta: 'Activando el modo Escala de grises (botón superior A-10), el paso activo se distingue por la palabra explícita "Actual" subrayada, el borde doble de 2px + barra inferior de 4px y el atributo semántico aria-current="step" legible por teclado.'
  },
  {
    codigo: 'IHC-A-11',
    caso: 'Dashboard UX',
    titulo: 'Vista estrecha',
    persona: 'Moderador que registra la sesión desde una ventana estrecha de 320 px',
    tarea: 'Operar el paso actual y pulsar Completar/Siguiente en 320 px sin scroll horizontal',
    evento: 'Se reduce la ventana a 320 px y el botón Siguiente queda fuera de pantalla.',
    cambio: 'Ajustar maquetación responsiva a 320 px, evitar desplazamiento horizontal y conservar orden de lectura.',
    evidencias: 'Modo vista 320 px integrable, capturas móviles, checklist de accesibilidad, commit.',
    pregunta: '¿Qué ley Gestalt aplica y qué carga cognitiva se reduce?',
    respuesta: 'Aplica las leyes de Proximidad y Región Común al apilar en una sola columna de 320 px cada grupo lógico con su botón de acción visible al 100% de ancho, reduciendo la carga cognitiva extrínseca y el esfuerzo visual.'
  },
  {
    codigo: 'IHC-A-12',
    caso: 'Dashboard UX',
    titulo: 'Finalización prematura',
    persona: 'Investigadora que retoma una sesión de usabilidad interrumpida (P-07)',
    tarea: 'Recuperar el checklist, impedir cierre falso y verificar el cierre con huella FNV-1a',
    evento: 'El sistema marca finalizada una sesión aunque falta un requisito del checklist.',
    cambio: 'Impedir finalización falsa, explicar elemento pendiente con foco directo, permitir completarlo sin borrar datos y verificar cierre con huella FNV-1a.',
    evidencias: 'Flujo actualizado, tres estados, test con ?fallo=1 y detección de alteración en localStorage, commit.',
    pregunta: '¿Cómo muestra el momento de verdad y comprueba el estado final?',
    respuesta: 'En el MdV 2 (Cerrar), bloquea el cierre si faltan obligatorios listando cada pendiente con traslado de foco; luego exige Revisión previa editable y verifica el guardado releyendo localStorage y comparando el hash FNV-1a (estaVerificada() + huella()).'
  }
];

function datosDemo() {
  const ayer = new Date(); ayer.setDate(ayer.getDate() - 1); ayer.setHours(10, 42, 0, 0);
  return {
    id: 'P-07',
    titulo: 'App de matrícula',
    cerrada: false,
    cierre: null,
    guardadoEn: ayer.toISOString(),
    pasos: [
      { nombre: 'Consentimiento', completado: true,  errores: 0, tiempo: 4,  obs: 'Firmó sin dudas.' },
      { nombre: 'Cuestionario previo', completado: true,  errores: 0, tiempo: 5,  obs: '' },
      { nombre: 'Tarea 1: buscar asignatura', completado: true,  errores: 2, tiempo: 9,  obs: 'Buscó en el menú equivocado dos veces.' },
      { nombre: 'Tarea 2: matricularse', completado: false, errores: 1, tiempo: '', obs: 'Se cortó la luz en el paso de pago.' },
      { nombre: 'Cuestionario SUS', completado: false, errores: '', tiempo: '', obs: '' },
      { nombre: 'Cierre y agradecimiento', completado: false, errores: '', tiempo: '', obs: '' }
    ],
    checklist: [
      { id: 'c1', texto: 'Consentimiento firmado', obligatorio: true,  hecho: true },
      { id: 'c2', texto: 'Grabación guardada', obligatorio: true,  hecho: false },
      { id: 'c3', texto: 'Tiempos y errores registrados', obligatorio: true,  hecho: true },
      { id: 'c4', texto: 'Cuestionario SUS aplicado', obligatorio: true,  hecho: false },
      { id: 'c5', texto: 'Incentivo entregado', obligatorio: false, hecho: false },
      { id: 'c6', texto: 'Notas compartidas con el equipo', obligatorio: false, hecho: false }
    ]
  };
}

// ---------- Persistencia (RF-01) ----------
function leerGuardado() {
  try {
    const txt = localStorage.getItem(CLAVE);
    return txt ? JSON.parse(txt) : null;
  } catch (e) { return null; }
}

let s = leerGuardado() || datosDemo();
let pasoSel = pasoActual();
let filtroTarjetas = 'todas';
let tarjetaActiva = 'IHC-A-12';

function guardar() {
  s.guardadoEn = new Date().toISOString();
  try { localStorage.setItem(CLAVE, JSON.stringify(s)); } catch (e) { /* sin almacenamiento */ }
  pintarGuardado();
}

// ---------- Utilidades ----------
const $ = (id) => document.getElementById(id);
const hora = (iso) => new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
const fecha = (iso) => new Date(iso).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit' });
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Sanitización de privacidad (IHC-A-09: código anónimo tipo P-07, nunca nombres personales)
function sanitizarCodigoAnonimo(valor) {
  const limpio = String(valor || '').trim();
  if (/^P-\d{2,4}$/i.test(limpio)) return limpio.toUpperCase();
  return 'P-07';
}

function pasoActual() {
  const i = s.pasos.findIndex((p) => !p.completado);
  return i === -1 ? s.pasos.length - 1 : i;
}
const completados = (d = s) => d.pasos.filter((p) => p.completado).length;
const obligatorios = (d = s) => d.checklist.filter((c) => c.obligatorio);
const opcionales = (d = s) => d.checklist.filter((c) => !c.obligatorio);
const pendientesObligatorios = (d = s) => obligatorios(d).filter((c) => !c.hecho);
const pasosPendientes = (d = s) => d.pasos.map((p, i) => ({ ...p, i })).filter((p) => !p.completado);
const suma = (d, campo) => d.pasos.reduce((t, p) => t + (Number(p[campo]) || 0), 0);
const notas = (d) => d.pasos.filter((p) => String(p.obs).trim()).length;

// Huella del contenido (FNV-1a) → código legible tipo "K4-9B2E" (RF-06)
function huella(d) {
  const txt = JSON.stringify({ p: d.pasos, c: d.checklist });
  let h = 0x811c9dc5;
  for (let i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  const hex = h.toString(16).toUpperCase().padStart(8, '0');
  return hex.slice(0, 2) + '-' + hex.slice(2, 6);
}

// Verifica que la sesión esté cerrada, tenga los 6 pasos y 4 obligatorios, y su huella coincida
function estaVerificada(d = s) {
  return !!(d && d.cerrada && d.cierre && pendientesObligatorios(d).length === 0 && pasosPendientes(d).length === 0 && huella(d) === d.cierre.codigo);
}

function anunciar(msg) {
  const a = $('anuncio');
  a.textContent = '';
  setTimeout(() => { a.textContent = msg; }, 50);
}

function pintarGuardado() {
  $('guardado').textContent = s.guardadoEn ? '● Guardado ' + hora(s.guardadoEn) : '';
}

// ---------- Controles globales (IHC-A-10 Escala de grises, IHC-A-11 Vista 320px, Selector 12 tarjetas) ----------
$('b-toggle-grises').addEventListener('click', () => {
  const act = document.body.classList.toggle('modo-grises');
  $('b-toggle-grises').setAttribute('aria-pressed', String(act));
  anunciar(act ? 'Modo escala de grises activado (Tarjeta IHC-A-10).' : 'Modo escala de grises desactivado.');
});

$('b-toggle-320').addEventListener('click', () => {
  const act = document.body.classList.toggle('modo-320');
  $('b-toggle-320').setAttribute('aria-pressed', String(act));
  anunciar(act ? 'Vista estrecha de 320 píxeles activada (Tarjeta IHC-A-11).' : 'Vista estrecha de 320 píxeles desactivada.');
});

$('sel-tarjeta-rapida').addEventListener('change', (e) => {
  const cod = e.target.value;
  if (!cod) return;
  abrirTarjetaDetalle(cod);
});

// ---------- Navegación (foco al título: RNF-01) ----------
const pantallas = {
  inicio: 'p-inicio',
  sesion: 'p-sesion',
  revision: 'p-revision',
  cerrada: 'p-cerrada',
  tarjeta: 'p-tarjeta'
};
let actual = 'inicio';
let timerCierre = null;

function irA(nombre, enfocar = true) {
  actual = nombre;
  for (const [k, id] of Object.entries(pantallas)) $(id).hidden = k !== nombre;
  const migas = {
    inicio: 'Sesiones y 12 Tarjetas',
    sesion: `Sesiones › ${s.id}`,
    revision: `Sesiones › ${s.id} › Revisión`,
    cerrada: `Sesiones › ${s.id} › Cerrada`,
    tarjeta: `12 Tarjetas › ${tarjetaActiva}`
  };
  $('migas').textContent = migas[nombre];
  if (nombre === 'inicio') renderInicio();
  if (nombre === 'sesion') renderSesion();
  if (nombre === 'revision') renderRevision();
  if (nombre === 'cerrada') renderCerrada();
  if (enfocar) {
    const h1 = $(pantallas[nombre]).querySelector('h1');
    if (h1) h1.focus();
  }
}

// ---------- Inicio (RF-02, RF-06 + Catálogo de 12 Tarjetas) ----------
function renderInicio() {
  const verificada = estaVerificada(s);
  const est = verificada
    ? '<span class="badge cerrada">✓ Cerrada · verificada</span>'
    : s.cerrada ? '<span class="badge interrumpida">✕ Cerrada · NO verificada</span>'
    : '<span class="badge interrumpida">⚠ Interrumpida</span>';
  const detalle = verificada
    ? `Cerrada el ${fecha(s.cierre.en)} a las ${hora(s.cierre.en)} · código ${s.cierre.codigo}`
    : s.cerrada
    ? `Estado alterado tras el cierre (no coincide con el código ${s.cierre ? s.cierre.codigo : '—'})`
    : `Quedó en el paso ${pasoActual() + 1} de ${s.pasos.length} · Guardado ${fecha(s.guardadoEn)} ${hora(s.guardadoEn)}`;
  const hechos = obligatorios().filter((c) => c.hecho).length;
  $('lista-sesiones').innerHTML = `
    <article class="card sesion">
      <div>
        ${est} <span class="badge dux">Tarjeta Principal · IHC-A-12</span>
        <h2>${esc(s.id)} · ${esc(s.titulo)}</h2>
        <p>${detalle}</p>
        <p>${completados()} de ${s.pasos.length} pasos · ${hechos} de ${obligatorios().length} obligatorios</p>
      </div>
      <div class="acciones" style="margin-top:0">
        <button type="button" class="primario" id="b-retomar">${verificada ? 'Ver resumen' : 'Retomar'}</button>
      </div>
    </article>`;
  $('b-retomar').addEventListener('click', verificada ? () => irA('cerrada') : retomar);
  renderCatalogo12();
}

function renderCatalogo12() {
  const lista = TARJETAS_12.filter((t) => filtroTarjetas === 'todas' || t.caso === filtroTarjetas);
  $('grid-12-tarjetas').innerHTML = lista.map((t) => `
    <article class="card item-tarjeta-12 ${t.codigo === 'IHC-A-12' ? 'principal' : ''}">
      <div>
        <span class="badge ${t.caso === 'CafeU' ? 'cafeu' : 'dux'}">${esc(t.caso)}</span>
        <span class="badge">${esc(t.codigo)}</span>
        <h3>${esc(t.codigo)} · ${esc(t.titulo)}</h3>
        <p><strong>Evento imprevisto:</strong> ${esc(t.evento)}</p>
        <p><strong>Cambio obligatorio:</strong> ${esc(t.cambio)}</p>
      </div>
      <div class="acciones">
        <button type="button" class="${t.codigo === 'IHC-A-12' ? 'primario' : ''}" data-abrir-tarjeta="${t.codigo}">
          Probar simulador ${esc(t.codigo)}
        </button>
      </div>
    </article>`).join('');
}

document.querySelector('.filtros-tarjetas').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-filtro]');
  if (!b) return;
  filtroTarjetas = b.dataset.filtro;
  document.querySelectorAll('.filtros-tarjetas button').forEach((x) => x.classList.toggle('activo', x === b));
  renderCatalogo12();
});

$('grid-12-tarjetas').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-abrir-tarjeta]');
  if (!b) return;
  abrirTarjetaDetalle(b.dataset.abrirTarjeta);
});

$('b-volver-catalogo').addEventListener('click', () => {
  $('sel-tarjeta-rapida').value = '';
  irA('inicio');
});

function retomar() {
  if (s.cerrada && !estaVerificada(s)) {
    s.cerrada = false;
    guardar();
  }
  pasoSel = pasoActual();
  irA('sesion');
  const n = completados();
  if (n < 3) {
    // Nodo E0 del user flow: fallo al recuperar los pasos iniciales
    $('error').innerHTML = '<h2>Error: no se pudo recuperar el progreso inicial</h2><p>Faltan pasos previos esperados. <button type="button" id="b-reintentar-rec" class="enlace">Reintentar / restaurar datos locales</button></p>';
    $('error').hidden = false;
    $('b-reintentar-rec').addEventListener('click', () => {
      s = datosDemo();
      guardar();
      retomar();
    });
    return;
  }
  const hechos = obligatorios().filter((c) => c.hecho).length;
  const msg = `Recuperamos ${n} pasos completados y ${hechos} de ${obligatorios().length} ítems obligatorios. Continúas en el paso ${pasoSel + 1}: ${s.pasos[pasoSel].nombre}.`;
  $('aviso').textContent = msg;
  $('aviso').hidden = false;
  anunciar(msg);
}

// ---------- Sesión (integra IHC-A-07, A-08, A-09, A-10, A-11, A-12) ----------
function renderSesion() {
  renderStepper();
  renderRegistro();
  renderChecklist();
  $('error').hidden = true;
}

function renderStepper() {
  const act = pasoActual();
  $('stepper').innerHTML = s.pasos.map((p, i) => {
    const estado = p.completado ? 'Completado' : (i === act ? 'Actual' : 'Pendiente');
    const clases = [p.completado ? 'completado' : '', i === act ? 'actual' : '', i === pasoSel ? 'seleccionado' : ''].join(' ');
    return `<li class="${clases}">
      <button type="button" data-paso="${i}" ${i === act ? 'aria-current="step"' : ''} aria-pressed="${i === pasoSel}">
        <span class="num">${p.completado ? '✓' : i + 1} ${p.nombre}</span>
        <span class="estado">${estado}</span>
      </button></li>`;
  }).join('');
}

function renderRegistro() {
  const p = s.pasos[pasoSel];
  $('t-registro').textContent = `Registro · Paso ${pasoSel + 1}: ${p.nombre}`;
  $('f-participante').value = s.id;
  $('f-errores').value = p.errores;
  $('f-tiempo').value = p.tiempo;
  $('f-obs').value = p.obs;
  $('b-completar').hidden = p.completado;
  $('b-reabrir').hidden = !p.completado;
}

// RF-03: dos regiones (Gestalt: región común) y etiqueta textual, no solo asterisco
function renderChecklist(marcarFaltas = false) {
  const item = (c) => `
    <li class="${marcarFaltas && c.obligatorio && !c.hecho ? 'falta' : ''}">
      <input type="checkbox" id="${c.id}" ${c.hecho ? 'checked' : ''}>
      <label for="${c.id}">${c.texto}</label>
      ${c.obligatorio ? '<span class="etiqueta">Obligatorio</span>' : ''}
    </li>`;
  const hechos = obligatorios().filter((c) => c.hecho).length;
  $('checklist').innerHTML = `
    <fieldset class="grupo oblig">
      <legend id="leg-oblig">Obligatorios · ${hechos} de ${obligatorios().length}</legend>
      <ul class="checklist">${obligatorios().map(item).join('')}</ul>
    </fieldset>
    <fieldset class="grupo">
      <legend>Opcionales</legend>
      <ul class="checklist">${opcionales().map(item).join('')}</ul>
    </fieldset>`;
}

$('stepper').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-paso]');
  if (!b) return;
  seleccionarPaso(Number(b.dataset.paso));
});

function seleccionarPaso(i) {
  pasoSel = i;
  renderStepper();
  renderRegistro();
  $('stepper').querySelector(`[data-paso="${i}"]`).focus();
}

// Validación de código anónimo (IHC-A-09: nunca guardar nombres personales)
$('f-participante').addEventListener('change', (e) => {
  const original = e.target.value.trim();
  const anon = sanitizarCodigoAnonimo(original);
  s.id = anon;
  e.target.value = anon;
  $('t-sesion').textContent = `Sesión ${s.id} · ${s.titulo}`;
  if (original !== anon) {
    $('ayuda-privacidad').textContent = `⚠ Dato personal bloqueado ("${original}"): sustituido por código anónimo ${anon} (IHC-A-09).`;
    anunciar(`Dato personal sustituido por código anónimo ${anon}.`);
  } else {
    $('ayuda-privacidad').textContent = `✓ Privacidad protegida: código anónimo ${anon} activo.`;
  }
  guardar();
});

// Guardado automático sin permitir valores negativos
for (const [id, campo] of [['f-errores', 'errores'], ['f-tiempo', 'tiempo'], ['f-obs', 'obs']]) {
  $(id).addEventListener('input', (e) => {
    if (campo !== 'obs' && e.target.value !== '' && Number(e.target.value) < 0) e.target.value = 0;
    s.pasos[pasoSel][campo] = e.target.value;
    guardar();
  });
}

$('b-completar').addEventListener('click', () => {
  if (pasoSel > 0 && !s.pasos[pasoSel - 1].completado) {
    mostrarErrores(pendientesObligatorios(), pasosPendientes(), `Completa primero el paso ${pasoSel}: ${s.pasos[pasoSel - 1].nombre}.`);
    return;
  }
  s.pasos[pasoSel].completado = true;
  guardar();
  anunciar(`Paso ${pasoSel + 1} completado.`);
  pasoSel = pasoActual();
  renderStepper();
  renderRegistro();
  if (!$('error').hidden) actualizarBannerErrores();
  $('t-registro').focus();
});

$('b-reabrir').addEventListener('click', () => {
  s.pasos[pasoSel].completado = false;
  guardar();
  anunciar(`Paso ${pasoSel + 1} reabierto para edición.`);
  renderStepper();
  renderRegistro();
  if (!$('error').hidden) actualizarBannerErrores();
  $('b-completar').focus();
});

$('checklist').addEventListener('change', (e) => {
  const c = s.checklist.find((x) => x.id === e.target.id);
  c.hecho = e.target.checked;
  guardar();
  const hechos = obligatorios().filter((x) => x.hecho).length;
  $('leg-oblig').textContent = `Obligatorios · ${hechos} de ${obligatorios().length}`;
  if (c.obligatorio) anunciar(`${c.texto}: ${c.hecho ? 'marcado' : 'desmarcado'}. ${hechos} de ${obligatorios().length} obligatorios.`);
  e.target.closest('li').classList.toggle('falta', c.obligatorio && !c.hecho && !$('error').hidden);
  if (!$('error').hidden) actualizarBannerErrores();
});

// ---------- Validación antes del cierre (RF-04, RF-05) ----------
$('b-cerrar').addEventListener('click', intentarCerrar);

function intentarCerrar() {
  const faltan = pendientesObligatorios();
  const pasos = pasosPendientes();
  if (faltan.length || pasos.length) {
    mostrarErrores(faltan, pasos);
    return;
  }
  $('error').hidden = true;
  irA('revision');
}

function actualizarBannerErrores() {
  const faltan = pendientesObligatorios();
  const pasos = pasosPendientes();
  if (!faltan.length && !pasos.length) {
    $('error').hidden = true;
    return;
  }
  mostrarErrores(faltan, pasos, null, false);
}

function mostrarErrores(faltan, pasos, extraMsg = null, moverFoco = true) {
  const total = faltan.length + pasos.length;
  $('error').innerHTML = `
    <h2>No se puede cerrar la sesión todavía</h2>
    ${extraMsg ? `<p><strong>${esc(extraMsg)}</strong></p>` : ''}
    <p>Faltan ${total} elemento${total > 1 ? 's' : ''}. Tus datos están guardados.</p>
    <ul>
      ${pasos.map((p) => `<li><a href="#" data-ir-paso="${p.i}">Paso ${p.i + 1}: ${p.nombre} (sin completar)</a></li>`).join('')}
      ${faltan.map((c) => `<li><a href="#" data-ir-check="${c.id}">${c.texto} (obligatorio)</a></li>`).join('')}
    </ul>`;
  $('error').hidden = false;
  renderChecklist(true);
  if (moverFoco) $('error').focus();
}

// Rama "editar": cada enlace lleva el foco al control pendiente
$('error').addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  e.preventDefault();
  if (a.dataset.irCheck) $(a.dataset.irCheck).focus();
  if (a.dataset.irPaso) seleccionarPaso(Number(a.dataset.irPaso));
});

// ---------- Revisión previa (RF-06, incidencia) ----------
function renderRevision() {
  $('error-cierre').hidden = true;
  const lista = (arr) => arr.map((c) => `<li>${c.hecho ? '✓' : '○'} ${c.texto}${c.hecho ? '' : ' (sin marcar)'}</li>`).join('');
  $('revision').innerHTML = `
    <section>
      <div class="cabecera"><h2>Participante (anónimo · IHC-A-09)</h2><button type="button" data-editar="registro">Editar registro</button></div>
      <p>Código anónimo: <strong>${esc(sanitizarCodigoAnonimo(s.id))}</strong> (datos personales excluidos del resumen)</p>
    </section>
    <section>
      <div class="cabecera"><h2>Pasos</h2><button type="button" data-editar="pasos">Editar pasos</button></div>
      <p>${completados()} de ${s.pasos.length} completados</p>
    </section>
    <section>
      <div class="cabecera"><h2>Registro</h2><button type="button" data-editar="registro">Editar registro</button></div>
      <p>Errores: ${suma(s, 'errores')} · Tiempo total: ${suma(s, 'tiempo')} min · Observaciones: ${notas(s)} notas</p>
    </section>
    <section>
      <div class="cabecera"><h2>Checklist</h2><button type="button" data-editar="checklist">Editar checklist</button></div>
      <p><strong>Obligatorios: ${obligatorios().filter((c) => c.hecho).length} de ${obligatorios().length}</strong></p>
      <ul>${lista(obligatorios())}</ul>
      <p>Opcionales: ${opcionales().filter((c) => c.hecho).length} de ${opcionales().length}</p>
      <ul>${lista(opcionales())}</ul>
    </section>`;
}

$('revision').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-editar]');
  if (!b) return;
  irA('sesion', false);
  const destino = { pasos: () => $('stepper').querySelector('button').focus(), registro: () => $('t-registro').focus(), checklist: () => $('t-check').focus() };
  destino[b.dataset.editar]();
});

$('b-volver-sesion').addEventListener('click', () => {
  if (timerCierre) return;
  irA('sesion');
});
$('b-confirmar').addEventListener('click', confirmarCierre);

// El éxito solo se anuncia si lo releído del almacenamiento coincide con lo enviado
function confirmarCierre() {
  if (pendientesObligatorios().length || pasosPendientes().length) { irA('sesion'); intentarCerrar(); return; }
  const b = $('b-confirmar');
  b.disabled = true;
  b.classList.add('girando');
  b.textContent = 'Cerrando y verificando…';
  b.setAttribute('aria-busy', 'true');
  anunciar('Cerrando y verificando la sesión…');

  timerCierre = setTimeout(() => {
    timerCierre = null;
    s.id = sanitizarCodigoAnonimo(s.id);
    const esperado = huella(s);
    const ahora = new Date().toISOString();
    s.cerrada = true;
    s.cierre = { codigo: esperado, en: ahora };
    let ok = false;
    try {
      if (SIMULAR_FALLO) throw new Error('fallo simulado');
      localStorage.setItem(CLAVE, JSON.stringify({ ...s, guardadoEn: ahora }));
      const leido = leerGuardado();
      ok = estaVerificada(leido) && leido.cierre.codigo === esperado;
    } catch (e) { ok = false; }

    b.disabled = false;
    b.classList.remove('girando');
    b.textContent = 'Confirmar cierre';
    b.removeAttribute('aria-busy');

    if (!ok) {
      s.cerrada = false;
      s.cierre = null;
      $('error-cierre').innerHTML = '<h2>No se pudo confirmar el cierre</h2><p>El guardado no se verificó, así que la sesión sigue <strong>abierta</strong>. Tus datos se conservan; pulsa “Confirmar cierre” para reintentar.</p>';
      $('error-cierre').hidden = false;
      $('error-cierre').focus();
      return;
    }
    s.guardadoEn = ahora;
    pintarGuardado();
    irA('cerrada');
    anunciar(`Sesión cerrada y verificada. Código ${esperado}.`);
  }, 1000);
}

// ---------- Confirmación con resumen comprobable ----------
function renderCerrada() {
  const d = leerGuardado() || s;
  const verificada = estaVerificada(d);
  const codParticipante = sanitizarCodigoAnonimo(d.id);
  $('t-cerrada').textContent = verificada
    ? `Sesión ${codParticipante} cerrada y verificada`
    : `Sesión ${codParticipante} cerrada · NO verificada`;
  $('codigo').textContent = d.cierre ? d.cierre.codigo : '—';
  $('cerrada-en').textContent = d.cierre
    ? `Cerrada el ${fecha(d.cierre.en)} a las ${hora(d.cierre.en)}`
    : 'Sin fecha de cierre verificada';
  const nombres = obligatorios(d).filter((c) => c.hecho).map((c) => c.texto).join(', ');
  $('resumen').innerHTML = `
    <h2>Resumen comprobable</h2>
    <dl>
      <dt>Participante (anónimo)</dt><dd>${esc(codParticipante)} (sin datos personales · IHC-A-09)</dd>
      <dt>Estado de integridad</dt><dd>${verificada ? '✓ Verificada (coincide con el código)' : '✕ Alterada o incompleta'}</dd>
      <dt>Pasos</dt><dd>${completados(d)} de ${d.pasos.length} completados</dd>
      <dt>Checklist obligatorio</dt><dd>${obligatorios(d).filter((c) => c.hecho).length} de ${obligatorios(d).length} ${obligatorios(d).every((c) => c.hecho) ? '✓' : '✕'} (${esc(nombres)})</dd>
      <dt>Opcionales</dt><dd>${opcionales(d).filter((c) => c.hecho).length} de ${opcionales(d).length}</dd>
      <dt>Errores registrados</dt><dd>${suma(d, 'errores')}</dd>
      <dt>Tiempo total</dt><dd>${suma(d, 'tiempo')} min</dd>
      <dt>Observaciones</dt><dd>${notas(d)} notas</dd>
    </dl>`;
  $('verif').textContent = '';
  $('verif').className = 'verif';
}

$('b-comprobar').addEventListener('click', () => {
  const d = leerGuardado();
  const ok = estaVerificada(d);
  renderCerrada();
  $('verif').textContent = ok
    ? `✓ Coincide: lo guardado produce el código ${d.cierre.codigo} (${hora(new Date().toISOString())}).`
    : '✕ No coincide: el registro guardado fue modificado, faltan obligatorios o no existe. Revisa la sesión.';
  $('verif').className = 'verif ' + (ok ? 'ok' : 'mal');
});

$('b-volver').addEventListener('click', () => irA('inicio'));

// ---------- Vista y Simulador Interactivo de cada una de las 12 Tarjetas ----------
function abrirTarjetaDetalle(codigo) {
  const t = TARJETAS_12.find((x) => x.codigo === codigo);
  if (!t) return;
  tarjetaActiva = codigo;
  $('sel-tarjeta-rapida').value = codigo;
  irA('tarjeta', false);
  $('contenido-tarjeta-detalle').innerHTML = `
    <article class="card">
      <span class="badge ${t.caso === 'CafeU' ? 'cafeu' : 'dux'}">${esc(t.caso)}</span>
      <span class="badge">${esc(t.codigo)}</span>
      <h1 id="t-tarjeta-detalle" tabindex="-1">${esc(t.codigo)} · ${esc(t.titulo)}</h1>
      <dl class="resumen" style="margin-bottom:12px">
        <dt>Persona</dt><dd>${esc(t.persona)}</dd>
        <dt>Tarea crítica</dt><dd>${esc(t.tarea)}</dd>
        <dt>Evento imprevisto (min 100)</dt><dd>${esc(t.evento)}</dd>
        <dt>Cambio obligatorio</dt><dd>${esc(t.cambio)}</dd>
        <dt>Evidencias</dt><dd>${esc(t.evidencias)}</dd>
      </dl>
      <div class="aviso">
        <strong>Pregunta de defensa individual:</strong> ${esc(t.pregunta)}<br>
        <strong>Respuesta fundamentada:</strong> ${esc(t.respuesta)}
      </div>
    </article>
    <section class="card panel-simulador" aria-labelledby="t-sim-vivo">
      <h2 id="t-sim-vivo">Simulador Funcional en Vivo · ${esc(t.codigo)} (${esc(t.titulo)})</h2>
      <div id="zona-simulador"></div>
    </section>`;
  montarSimuladorInteractivo(codigo);
  $('t-tarjeta-detalle').focus();
}

function montarSimuladorInteractivo(codigo) {
  const z = $('zona-simulador');

  if (codigo === 'IHC-A-01') {
    let cantCafe = 1;
    let revisado = true;
    const precioCafe = 2.50;
    const precioCroissant = 1.75;
    const totalInicial = 4.25;
    const pintar = (confirmado = false) => {
      const subCafe = cantCafe * precioCafe;
      const totalActual = subCafe + precioCroissant;
      const diff = totalActual - totalInicial;
      z.innerHTML = `
        <p>Modifica la cantidad de cafés (de 1 a 2) para comprobar cómo se actualiza el subtotal, se identifica la diferencia y se exige una nueva revisión antes de confirmar:</p>
        <div class="fila">
          <label>Café Americano (USD 2,50 c/u)
            <input type="number" id="sim01-cant" min="1" max="10" value="${cantCafe}">
          </label>
          <div>
            <p style="margin:0">Subtotal Café: <strong>USD ${subCafe.toFixed(2)}</strong></p>
            <p style="margin:0">Croissant fijo: <strong>USD 1,75</strong></p>
          </div>
        </div>
        <div class="caja-estado-sim ${revisado ? 'ok' : 'pend'}" role="status">
          Total original: USD ${totalInicial.toFixed(2)} ·
          Diferencia: <strong>${diff >= 0 ? '+' : ''}USD ${diff.toFixed(2)}</strong> ·
          <strong>Nuevo Total Real: USD ${totalActual.toFixed(2)}</strong><br>
          ${revisado ? '✓ Nuevo total revisado y verificado.' : '⚠ El precio cambió al editar: debes revisar y aceptar el nuevo total antes de confirmar.'}
        </div>
        ${confirmado ? `<div class="caja-estado-sim ok">✓ Pedido confirmado por USD ${totalActual.toFixed(2)} tras revisión verificada.</div>` : ''}
        <div class="acciones">
          <button type="button" id="sim01-revisar" ${revisado ? 'disabled' : ''} class="primario">1. Revisar y aceptar nuevo total (USD ${totalActual.toFixed(2)})</button>
          <button type="button" id="sim01-confirmar" ${!revisado ? 'disabled' : ''} class="primario">2. Confirmar pedido</button>
        </div>`;
      $('sim01-cant').addEventListener('input', (e) => {
        cantCafe = Math.max(1, Number(e.target.value) || 1);
        revisado = false;
        pintar(false);
        anunciar(`Cantidad actualizada a ${cantCafe}. Nuevo total USD ${(cantCafe * precioCafe + precioCroissant).toFixed(2)}. Requiere revisión.`);
      });
      $('sim01-revisar').addEventListener('click', () => {
        revisado = true;
        pintar(false);
        anunciar('Nuevo total revisado y aceptado. Ya puedes confirmar.');
        $('sim01-confirmar').focus();
      });
      $('sim01-confirmar').addEventListener('click', () => {
        pintar(true);
        anunciar('Pedido confirmado con el total actualizado.');
      });
    };
    pintar();
    return;
  }

  if (codigo === 'IHC-A-02') {
    let items = [
      { id: 'p1', nombre: 'Capuccino Mediano', precio: 2.75 },
      { id: 'p2', nombre: 'Sánduche de Queso', precio: 2.25 }
    ];
    let ultimoEliminado = null;
    const pintar = (msg = '') => {
      z.innerHTML = `
        <p>Usa <strong>Tab</strong> y <strong>Enter</strong> sobre "Quitar" sin usar el ratón: el foco se traslada automáticamente al botón <strong>Deshacer</strong> y el lector anuncia qué producto se quitó.</p>
        ${msg ? `<div class="caja-estado-sim pend" role="status">${esc(msg)}</div>` : ''}
        <ul class="checklist">
          ${items.map((it) => `
            <li style="grid-template-columns: 1fr auto">
              <span><strong>${esc(it.nombre)}</strong> — USD ${it.precio.toFixed(2)}</span>
              <button type="button" data-quitar="${it.id}">Quitar ${esc(it.nombre)}</button>
            </li>`).join('')}
        </ul>
        <div class="acciones">
          <button type="button" id="sim02-deshacer" ${!ultimoEliminado ? 'disabled' : ''}>Deshacer eliminación ${ultimoEliminado ? `(${esc(ultimoEliminado.nombre)})` : ''}</button>
          <button type="button" id="sim02-confirmar" class="primario" ${!items.length ? 'disabled' : ''}>Confirmar carrito (${items.length} ítems)</button>
        </div>`;
      z.querySelectorAll('button[data-quitar]').forEach((b) => {
        b.addEventListener('click', () => {
          const idx = items.findIndex((x) => x.id === b.dataset.quitar);
          if (idx === -1) return;
          ultimoEliminado = items[idx];
          items.splice(idx, 1);
          const texto = `Se eliminó "${ultimoEliminado.nombre}". Foco en Deshacer por si deseas restaurarlo.`;
          pintar(texto);
          anunciar(texto);
          $('sim02-deshacer').focus();
        });
      });
      $('sim02-deshacer').addEventListener('click', () => {
        if (!ultimoEliminado) return;
        const rest = ultimoEliminado;
        items.push(rest);
        ultimoEliminado = null;
        const texto = `Producto "${rest.nombre}" restaurado al carrito.`;
        pintar(texto);
        anunciar(texto);
        const btn = z.querySelector(`button[data-quitar="${rest.id}"]`);
        if (btn) btn.focus();
      });
      $('sim02-confirmar').addEventListener('click', () => {
        pintar('✓ Carrito confirmado exitosamente operando con teclado.');
        anunciar('Carrito confirmado exitosamente.');
      });
    };
    pintar();
    return;
  }

  if (codigo === 'IHC-A-03') {
    let estado = 'normal'; // normal | pendiente | confirmado | error
    let seg = 8;
    let clicsBloqueados = 0;
    let timer03 = null;
    const pintar = () => {
      z.innerHTML = `
        <p>Pulsa "Confirmar pedido": la respuesta tarda 8 segundos. Intenta hacer doble clic: el botón bloquea repeticiones y diferencia claramente <em>Pendiente</em> de <em>Confirmado</em>.</p>
        <label style="display:inline-flex;align-items:center;gap:8px;color:var(--texto)">
          <input type="checkbox" id="sim03-fallar" style="width:18px;height:18px;margin:0"> Simular respuesta "No confirmado" al terminar los 8 s
        </label>
        <div class="caja-estado-sim ${estado === 'confirmado' ? 'ok' : estado === 'error' ? 'err' : estado === 'pendiente' ? 'pend' : ''}" role="${estado === 'error' ? 'alert' : 'status'}">
          ${estado === 'normal' ? 'Estado actual: Listo para enviar (1 orden en carrito).' : ''}
          ${estado === 'pendiente' ? `⏳ Estado: PENDIENTE DE CONFIRMACIÓN (${seg} s restantes)… No se ha duplicado el pedido (intentos extra bloqueados: ${clicsBloqueados}).` : ''}
          ${estado === 'confirmado' ? '✓ Estado: PEDIDO CONFIRMADO · Código único #CU-8041 (1 sola orden procesada).' : ''}
          ${estado === 'error' ? '✕ Estado: NO CONFIRMADO · El servidor rechazó la transacción. No se realizó ningún cobro duplicado.' : ''}
        </div>
        <div class="acciones">
          <button type="button" id="sim03-btn" class="primario ${estado === 'pendiente' ? 'girando' : ''}" ${estado === 'pendiente' ? 'disabled aria-busy="true"' : ''}>
            ${estado === 'pendiente' ? `Procesando (${seg} s)…` : 'Confirmar pedido (demora 8 s)'}
          </button>
          <button type="button" id="sim03-intento-extra" ${estado !== 'pendiente' ? 'hidden' : ''}>Simular clic impaciente del usuario</button>
        </div>`;
      $('sim03-btn').addEventListener('click', () => {
        if (estado === 'pendiente') return;
        const fallar = $('sim03-fallar').checked;
        estado = 'pendiente';
        seg = 8;
        clicsBloqueados = 0;
        pintar();
        anunciar('Pedido en estado pendiente. Esperando confirmación durante 8 segundos.');
        clearInterval(timer03);
        timer03 = setInterval(() => {
          seg -= 1;
          if (seg <= 0) {
            clearInterval(timer03);
            estado = fallar ? 'error' : 'confirmado';
            pintar();
            anunciar(estado === 'confirmado' ? 'Pedido confirmado sin duplicados.' : 'Pedido no confirmado.');
          } else {
            pintar();
          }
        }, 1000);
      });
      const bExtra = $('sim03-intento-extra');
      if (bExtra) {
        bExtra.addEventListener('click', () => {
          clicsBloqueados += 1;
          pintar();
          anunciar('Clic adicional bloqueado por clave de idempotencia.');
        });
      }
    };
    pintar();
    return;
  }

  if (codigo === 'IHC-A-04') {
    let leche = 'Leche entera (contiene alérgeno lácteo y trazas de avellana)';
    let libreAlergeno = false;
    let confirmado = false;
    const pintar = () => {
      z.innerHTML = `
        <p>Carrito actual: <strong>1x Latte Vainilla</strong> (${esc(leche)}) + <strong>1x Muffin de arándanos</strong> (conservado en el carrito).</p>
        ${!libreAlergeno ? `
          <div class="error" role="alert">
            <h2>⚠ Alerta de alérgeno detectado antes de confirmar</h2>
            <p>El producto <strong>Latte Vainilla</strong> contiene <strong>lácteos y trazas de avellana</strong> no visibles previamente. Puedes volver al detalle y cambiar la base sin vaciar tu carrito.</p>
          </div>` : `
          <div class="caja-estado-sim ok" role="status">
            ✓ Ingrediente corregido a opción segura (${esc(leche)}). El resto de tu carrito (Muffin de arándanos) se conservó intacto.
          </div>`}
        ${confirmado ? `<div class="caja-estado-sim ok">✓ Pedido confirmado de forma segura sin alérgenos.</div>` : ''}
        <div class="acciones">
          <button type="button" id="sim04-detalle" class="${!libreAlergeno ? 'primario' : ''}">Volver al detalle y cambiar a Leche de Almendra (sin vaciar carrito)</button>
          <button type="button" id="sim04-confirmar" class="primario" ${!libreAlergeno ? 'disabled' : ''}>Confirmar pedido seguro</button>
        </div>`;
      $('sim04-detalle').addEventListener('click', () => {
        leche = 'Bebida de avena certificada libre de lácteos y nueces';
        libreAlergeno = true;
        confirmado = false;
        pintar();
        anunciar('Ingrediente cambiado a bebida de avena sin alérgenos. Carrito conservado.');
        $('sim04-confirmar').focus();
      });
      $('sim04-confirmar').addEventListener('click', () => {
        confirmado = true;
        pintar();
        anunciar('Pedido confirmado sin riesgo de alérgenos.');
      });
    };
    pintar();
    return;
  }

  if (codigo === 'IHC-A-05') {
    let cant = 2;
    const precioUnit = 2.65; // subió +0.50 en total (de 4.80 a 5.30)
    const presupuesto = 5.00;
    let estado = 'alerta'; // alerta | confirmado | cancelado
    const pintar = () => {
      const total = cant * precioUnit;
      const excede = total > presupuesto;
      z.innerHTML = `
        <p>Presupuesto máximo del usuario: <strong>USD ${presupuesto.toFixed(2)}</strong> · Precio actualizado (+USD 0,50 de incremento antes de confirmar).</p>
        <div class="caja-estado-sim ${excede ? 'err' : 'ok'}" role="${excede ? 'alert' : 'status'}">
          Desglose: ${cant}x Combo Café (USD ${precioUnit.toFixed(2)} c/u, incluye +USD 0,25 de incremento por insumo) = <strong>Total USD ${total.toFixed(2)}</strong>.<br>
          ${excede ? `⚠ Presupuesto agotado: el total (USD ${total.toFixed(2)}) supera tu presupuesto de USD ${presupuesto.toFixed(2)} por el incremento de USD 0,50. Reduce la cantidad o cancela.` : `✓ Dentro del presupuesto (USD ${total.toFixed(2)} ≤ USD ${presupuesto.toFixed(2)}).`}
        </div>
        ${estado === 'confirmado' ? '<div class="caja-estado-sim ok">✓ Pedido confirmado dentro de tu presupuesto.</div>' : ''}
        ${estado === 'cancelado' ? '<div class="caja-estado-sim pend">Pedido cancelado sin cargos por cambio de precio.</div>' : ''}
        <div class="acciones">
          <button type="button" id="sim05-reducir">Reducir cantidad a 1 combo (USD 2,65)</button>
          <button type="button" id="sim05-confirmar" class="primario" ${excede ? 'disabled' : ''}>Confirmar con nuevo total</button>
          <button type="button" id="sim05-cancelar">Cancelar pedido sin costo</button>
        </div>`;
      $('sim05-reducir').addEventListener('click', () => {
        cant = 1;
        estado = 'alerta';
        pintar();
        anunciar('Cantidad reducida a 1 combo. Nuevo total USD 2,65 dentro del presupuesto.');
        $('sim05-confirmar').focus();
      });
      $('sim05-confirmar').addEventListener('click', () => {
        estado = 'confirmado';
        pintar();
        anunciar('Pedido confirmado dentro del presupuesto.');
      });
      $('sim05-cancelar').addEventListener('click', () => {
        estado = 'cancelado';
        pintar();
        anunciar('Pedido cancelado por el usuario.');
      });
    };
    pintar();
    return;
  }

  if (codigo === 'IHC-A-06') {
    let est = 'caido'; // verificando | caido | confirmado
    const pintar = () => {
      z.innerHTML = `
        <p>Diferenciación visual y semántica de los <strong>3 estados</strong> ante corte de red en el instante de confirmar:</p>
        ${est === 'verificando' ? `<div class="caja-estado-sim pend" role="status" aria-busy="true">1) Estado VERIFICANDO: Consultando estado de la transacción #CU-9012 con el servidor…</div>` : ''}
        ${est === 'caido' ? `<div class="caja-estado-sim err" role="alert">2) Estado NO CONFIRMADO (Falla de conexión): La red se interrumpió. No afirmamos éxito no verificado. Tus datos (2 ítems · USD 4,50) están guardados localmente.</div>` : ''}
        ${est === 'confirmado' ? `<div class="caja-estado-sim ok" role="status">3) Estado CONFIRMADO Y VERIFICADO: Conexión restablecida. Pedido #CU-9012 verificado sin duplicación.</div>` : ''}
        <div class="acciones">
          <button type="button" id="sim06-caer">Simular caída de red (Estado 2: No confirmado)</button>
          <button type="button" id="sim06-reintentar" class="primario">Reintento seguro (pasa por Estado 1 → Estado 3)</button>
        </div>`;
      $('sim06-caer').addEventListener('click', () => {
        est = 'caido';
        pintar();
        anunciar('Falla de conexión: pedido no confirmado. Datos conservados.');
      });
      $('sim06-reintentar').addEventListener('click', () => {
        est = 'verificando';
        pintar();
        anunciar('Reintentando envío seguro…');
        setTimeout(() => {
          est = 'confirmado';
          pintar();
          anunciar('Conexión recuperada: pedido confirmado y verificado.');
        }, 900);
      });
    };
    pintar();
    return;
  }

  // Tarjetas Dashboard UX (IHC-A-07 a IHC-A-12): tienen controles directos que operan sobre la sesión real P-07
  z.innerHTML = `
    <p>Esta tarjeta pertenece al caso base <strong>Dashboard UX</strong> y está integrada directamente en la sesión principal <strong>P-07</strong>:</p>
    <div class="caja-estado-sim ok" id="sim-dux-estado">
      ✓ Funcionalidad ${esc(codigo)} activa en el prototipo Dashboard UX.
    </div>
    <div class="acciones">
      ${codigo === 'IHC-A-07' ? `<button type="button" id="sim-accion-esp" class="primario">Probar bloqueo de avance secuencial en el Stepper (Sesión P-07)</button>` : ''}
      ${codigo === 'IHC-A-08' ? `<button type="button" id="sim-accion-esp" class="primario">Abrir Checklist persistente y verificar guardado entre etapas</button>` : ''}
      ${codigo === 'IHC-A-09' ? `<button type="button" id="sim-accion-esp" class="primario">Probar bloqueo de nombre personal ("Juan Pérez" → "P-07")</button>` : ''}
      ${codigo === 'IHC-A-10' ? `<button type="button" id="sim-accion-esp" class="primario">Alternar Modo Escala de Grises y abrir Stepper accesible</button>` : ''}
      ${codigo === 'IHC-A-11' ? `<button type="button" id="sim-accion-esp" class="primario">Alternar Vista Estrecha de 320 px y abrir Sesión</button>` : ''}
      ${codigo === 'IHC-A-12' ? `
        <button type="button" id="sim-accion-esp" class="primario">Ir a la Sesión P-07 (Probar bloqueo de cierre prematuro y huella FNV-1a)</button>
        <button type="button" id="sim-alterar-ls">Simular éxito falso / alteración en localStorage tras cerrar</button>
      ` : ''}
      <button type="button" id="sim-ir-sesion">Abrir Sesión P-07 completa</button>
    </div>`;

  $('sim-ir-sesion').addEventListener('click', retomar);
  const bEsp = $('sim-accion-esp');
  if (bEsp) {
    bEsp.addEventListener('click', () => {
      if (codigo === 'IHC-A-07') {
        retomar();
        seleccionarPaso(4); // intenta ir al paso 5 sin haber completado el 4
        $('b-completar').click();
      } else if (codigo === 'IHC-A-08') {
        retomar();
        $('c1').focus();
      } else if (codigo === 'IHC-A-09') {
        retomar();
        $('f-participante').value = 'Juan Pérez';
        $('f-participante').dispatchEvent(new Event('change'));
        $('f-participante').focus();
      } else if (codigo === 'IHC-A-10') {
        if (!document.body.classList.contains('modo-grises')) $('b-toggle-grises').click();
        retomar();
      } else if (codigo === 'IHC-A-11') {
        if (!document.body.classList.contains('modo-320')) $('b-toggle-320').click();
        retomar();
      } else if (codigo === 'IHC-A-12') {
        retomar();
        intentarCerrar();
      }
    });
  }
  const bAlt = $('sim-alterar-ls');
  if (bAlt) {
    bAlt.addEventListener('click', () => {
      // Cierra con huella pero desmarca un obligatorio para demostrar cómo estaVerificada() impide el éxito falso
      s.cerrada = true;
      s.cierre = { codigo: huella(s), en: new Date().toISOString() };
      s.checklist[0].hecho = false; // altera obligatorio después de cerrar
      guardar();
      irA('inicio');
      anunciar('Se simuló una alteración tras el cierre: Inicio muestra "Cerrada · NO verificada".');
    });
  }
}

// Escape: volver un nivel (RNF-01)
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (e.target.matches && e.target.matches('input, textarea, select')) return;
  if (timerCierre) return;
  if (actual === 'revision') irA('sesion');
  else if (actual === 'sesion' || actual === 'cerrada' || actual === 'tarjeta') irA('inicio');
});

$('b-reset').addEventListener('click', () => {
  try { localStorage.removeItem(CLAVE); } catch (e) { /* nada */ }
  s = datosDemo();
  pasoSel = pasoActual();
  irA('inicio');
  anunciar('Datos de demostración restablecidos.');
});

pintarGuardado();
const tarjetaUrl = params.get('tarjeta');
if (tarjetaUrl && TARJETAS_12.some((t) => t.codigo === tarjetaUrl)) {
  abrirTarjetaDetalle(tarjetaUrl);
} else {
  irA('inicio');
}
