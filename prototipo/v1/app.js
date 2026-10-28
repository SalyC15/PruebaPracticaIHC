// Dashboard UX · Prototipo v1 · Tarjeta IHC-A-12
// Tarea: recuperar checklist y cerrar sesión sin perder los pasos finalizados.
'use strict';

const CLAVE = 'dux12.v1.sesion';

// Estado inicial: la prueba se interrumpió en el paso 4 (RF-01, RF-02).
function datosDemo() {
  const ayer = new Date(); ayer.setDate(ayer.getDate() - 1); ayer.setHours(10, 42, 0, 0);
  return {
    id: 'P-07',
    titulo: 'App de matrícula',
    cerrada: false,
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
function cargar() {
  try {
    const txt = localStorage.getItem(CLAVE);
    if (txt) return JSON.parse(txt);
  } catch (e) { /* almacenamiento no disponible: se usa la demo en memoria */ }
  return datosDemo();
}

let s = cargar();
let pasoSel = pasoActual();

function guardar() {
  s.guardadoEn = new Date().toISOString();
  try { localStorage.setItem(CLAVE, JSON.stringify(s)); } catch (e) { /* sin almacenamiento */ }
  pintarGuardado();
}

// ---------- Utilidades ----------
const $ = (id) => document.getElementById(id);
const hora = (iso) => new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
const fecha = (iso) => new Date(iso).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit' });

function pasoActual() {
  const i = s.pasos.findIndex((p) => !p.completado);
  return i === -1 ? s.pasos.length - 1 : i;
}
const completados = () => s.pasos.filter((p) => p.completado).length;
const obligatorios = () => s.checklist.filter((c) => c.obligatorio);
const pendientesObligatorios = () => obligatorios().filter((c) => !c.hecho);

function anunciar(msg) {
  const a = $('anuncio');
  a.textContent = '';
  setTimeout(() => { a.textContent = msg; }, 50);
}

function pintarGuardado() {
  $('guardado').textContent = s.guardadoEn ? '● Guardado ' + hora(s.guardadoEn) : '';
}

// ---------- Navegación entre pantallas (foco al título: RNF-01) ----------
const pantallas = { inicio: 'p-inicio', sesion: 'p-sesion', cerrada: 'p-cerrada' };
let actual = 'inicio';

function irA(nombre) {
  actual = nombre;
  for (const [k, id] of Object.entries(pantallas)) $(id).hidden = k !== nombre;
  const migas = { inicio: 'Sesiones', sesion: 'Sesiones › P-07', cerrada: 'Sesiones › P-07 › Cerrada' };
  $('migas').textContent = migas[nombre];
  if (nombre === 'inicio') renderInicio();
  if (nombre === 'sesion') renderSesion();
  if (nombre === 'cerrada') renderCerrada();
  $(pantallas[nombre]).querySelector('h1').focus();
}

// ---------- Pantalla Inicio (RF-02) ----------
function renderInicio() {
  const est = s.cerrada
    ? '<span class="badge cerrada">✓ Cerrada</span>'
    : '<span class="badge interrumpida">⚠ Interrumpida</span>';
  const detalle = s.cerrada
    ? `Cerrada el ${fecha(s.guardadoEn)} a las ${hora(s.guardadoEn)}`
    : `Quedó en el paso ${pasoActual() + 1} de ${s.pasos.length} · Guardado ${fecha(s.guardadoEn)} ${hora(s.guardadoEn)}`;
  $('lista-sesiones').innerHTML = `
    <article class="card sesion">
      <div>
        ${est}
        <h2>${s.id} · ${s.titulo}</h2>
        <p>${detalle}</p>
        <p>${completados()} de ${s.pasos.length} pasos completados</p>
      </div>
      <button type="button" class="primario" id="b-retomar">${s.cerrada ? 'Ver resumen' : 'Retomar'}</button>
    </article>`;
  $('b-retomar').addEventListener('click', s.cerrada ? () => irA('cerrada') : retomar);
}

function retomar() {
  pasoSel = pasoActual();
  irA('sesion');
  const msg = `Recuperamos ${completados()} pasos completados. Continúas en el paso ${pasoSel + 1}: ${s.pasos[pasoSel].nombre}.`;
  $('aviso').textContent = msg;
  $('aviso').hidden = false;
  anunciar(msg);
}

// ---------- Pantalla Sesión ----------
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
  $('f-errores').value = p.errores;
  $('f-tiempo').value = p.tiempo;
  $('f-obs').value = p.obs;
  $('b-completar').hidden = p.completado;
  $('b-reabrir').hidden = !p.completado;
}

function renderChecklist() {
  $('checklist').innerHTML = s.checklist.map((c) => `
    <li>
      <input type="checkbox" id="${c.id}" ${c.hecho ? 'checked' : ''}>
      <label for="${c.id}">${c.texto}${c.obligatorio ? ' *' : ''}</label>
    </li>`).join('');
}

$('stepper').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-paso]');
  if (!b) return;
  pasoSel = Number(b.dataset.paso);
  renderStepper();
  renderRegistro();
  $('stepper').querySelector(`[data-paso="${pasoSel}"]`).focus();
});

// Guardado automático de cada campo del registro
for (const [id, campo] of [['f-errores', 'errores'], ['f-tiempo', 'tiempo'], ['f-obs', 'obs']]) {
  $(id).addEventListener('input', (e) => { s.pasos[pasoSel][campo] = e.target.value; guardar(); });
}

$('b-completar').addEventListener('click', () => {
  s.pasos[pasoSel].completado = true;
  guardar();
  anunciar(`Paso ${pasoSel + 1} completado.`);
  pasoSel = pasoActual();
  renderStepper();
  renderRegistro();
  $('t-registro').focus();
});

$('b-reabrir').addEventListener('click', () => {
  s.pasos[pasoSel].completado = false;
  guardar();
  anunciar(`Paso ${pasoSel + 1} reabierto para edición.`);
  renderStepper();
  renderRegistro();
});

$('checklist').addEventListener('change', (e) => {
  const c = s.checklist.find((x) => x.id === e.target.id);
  c.hecho = e.target.checked;
  guardar();
});

// ---------- Cierre (RF-04 / RF-05) ----------
$('b-cerrar').addEventListener('click', intentarCerrar);

function intentarCerrar() {
  if (pendientesObligatorios().length > 0) {
    // v1: mensaje genérico (no indica cuáles faltan)
    $('error').innerHTML = 'No se puede cerrar: hay ítems obligatorios pendientes.';
    $('error').hidden = false;
    $('error').focus();
    return;
  }
  const b = $('b-cerrar');
  b.disabled = true;
  b.classList.add('girando');
  b.textContent = 'Cerrando…';
  b.setAttribute('aria-busy', 'true');
  setTimeout(() => {
    s.cerrada = true;
    guardar();
    b.disabled = false;
    b.classList.remove('girando');
    b.textContent = 'Cerrar sesión';
    b.removeAttribute('aria-busy');
    irA('cerrada');
    anunciar('Sesión cerrada.');
  }, 1000);
}

// ---------- Pantalla Confirmación ----------
function renderCerrada() {
  const hechos = obligatorios().filter((c) => c.hecho).length;
  $('resumen').innerHTML = `
    <div class="resumen"><dl>
      <dt>Sesión</dt><dd>${s.id} · ${s.titulo}</dd>
      <dt>Pasos</dt><dd>${completados()} de ${s.pasos.length} completados</dd>
      <dt>Checklist obligatorio</dt><dd>${hechos} de ${obligatorios().length}</dd>
      <dt>Cerrada</dt><dd>${fecha(s.guardadoEn)} ${hora(s.guardadoEn)}</dd>
    </dl></div>`;
}

$('b-volver').addEventListener('click', () => irA('inicio'));

// Escape: volver un nivel (RNF-01)
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (actual === 'sesion' || actual === 'cerrada') irA('inicio');
});

$('b-reset').addEventListener('click', () => {
  try { localStorage.removeItem(CLAVE); } catch (e) { /* nada */ }
  s = datosDemo();
  pasoSel = pasoActual();
  irA('inicio');
  anunciar('Datos de demostración restablecidos.');
});

pintarGuardado();
irA('inicio');
