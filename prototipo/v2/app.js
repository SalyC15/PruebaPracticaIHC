// Dashboard UX · Prototipo v2 · Tarjeta IHC-A-12
// Cambios respecto a v1 (Fase 4 - Hallazgo de la prueba cognitiva · Issue #3):
//  - Obligatorios agrupados en región propia (<fieldset>) con etiqueta textual 'Obligatorio' y contador
//  - El mensaje de error enumera cada elemento pendiente con un enlace que lleva el foco al control
'use strict';

const CLAVE = 'dux12.v2.sesion';

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
function leerGuardado() {
  try {
    const txt = localStorage.getItem(CLAVE);
    return txt ? JSON.parse(txt) : null;
  } catch (e) { return null; }
}

let s = leerGuardado() || datosDemo();
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
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function pasoActual() {
  const i = s.pasos.findIndex((p) => !p.completado);
  return i === -1 ? s.pasos.length - 1 : i;
}
const completados = (d = s) => d.pasos.filter((p) => p.completado).length;
const obligatorios = (d = s) => d.checklist.filter((c) => c.obligatorio);
const opcionales = (d = s) => d.checklist.filter((c) => !c.obligatorio);
const pendientesObligatorios = (d = s) => obligatorios(d).filter((c) => !c.hecho);
const pasosPendientes = (d = s) => d.pasos.map((p, i) => ({ ...p, i })).filter((p) => !p.completado);

function anunciar(msg) {
  const a = $('anuncio');
  a.textContent = '';
  setTimeout(() => { a.textContent = msg; }, 50);
}

function pintarGuardado() {
  $('guardado').textContent = s.guardadoEn ? '● Guardado ' + hora(s.guardadoEn) : '';
}

// ---------- Navegación (foco al título: RNF-01) ----------
const pantallas = { inicio: 'p-inicio', sesion: 'p-sesion', cerrada: 'p-cerrada' };
let actual = 'inicio';
let timerCierre = null;

function irA(nombre, enfocar = true) {
  actual = nombre;
  for (const [k, id] of Object.entries(pantallas)) $(id).hidden = k !== nombre;
  const migas = { inicio: 'Sesiones', sesion: 'Sesiones › P-07', cerrada: 'Sesiones › P-07 › Cerrada' };
  $('migas').textContent = migas[nombre];
  if (nombre === 'inicio') renderInicio();
  if (nombre === 'sesion') renderSesion();
  if (nombre === 'cerrada') renderCerrada();
  if (enfocar) $(pantallas[nombre]).querySelector('h1').focus();
}

// ---------- Inicio (RF-02) ----------
function renderInicio() {
  const est = s.cerrada
    ? '<span class="badge cerrada">✓ Cerrada</span>'
    : '<span class="badge interrumpida">⚠ Interrumpida</span>';
  const detalle = s.cerrada
    ? `Cerrada el ${fecha(s.guardadoEn)} a las ${hora(s.guardadoEn)}`
    : `Quedó en el paso ${pasoActual() + 1} de ${s.pasos.length} · Guardado ${fecha(s.guardadoEn)} ${hora(s.guardadoEn)}`;
  const hechos = obligatorios().filter((c) => c.hecho).length;
  $('lista-sesiones').innerHTML = `
    <article class="card sesion">
      <div>
        ${est}
        <h2>${s.id} · ${s.titulo}</h2>
        <p>${detalle}</p>
        <p>${completados()} de ${s.pasos.length} pasos · ${hechos} de ${obligatorios().length} obligatorios</p>
      </div>
      <button type="button" class="primario" id="b-retomar">${s.cerrada ? 'Ver resumen' : 'Retomar'}</button>
    </article>`;
  $('b-retomar').addEventListener('click', s.cerrada ? () => irA('cerrada') : retomar);
}

function retomar() {
  pasoSel = pasoActual();
  irA('sesion');
  const n = completados();
  if (n < 3) {
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

// ---------- Sesión ----------
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
  const b = $('b-cerrar');
  b.disabled = true;
  b.classList.add('girando');
  b.textContent = 'Cerrando…';
  b.setAttribute('aria-busy', 'true');
  timerCierre = setTimeout(() => {
    timerCierre = null;
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
  if (e.target.matches && e.target.matches('input, textarea, select')) return;
  if (timerCierre) return;
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
