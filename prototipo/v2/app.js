// Dashboard UX · Prototipo v2 · Tarjeta IHC-A-12
// Cambios respecto a v1:
//  - Fase 4 (Issue #3): obligatorios en región propia con etiqueta textual y contador;
//    el error enumera cada pendiente con un enlace que lleva el foco al control.
//  - Fase 5 (Issue #4, incidencia): revisión previa editable, cierre que relee lo guardado
//    y compara un código de verificación; nunca se anuncia éxito sin esa comprobación.
'use strict';

const CLAVE = 'dux12.v2.sesion';
const SIMULAR_FALLO = new URLSearchParams(location.search).get('fallo') === '1';

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
const pendientesObligatorios = () => obligatorios().filter((c) => !c.hecho);
const pasosPendientes = () => s.pasos.map((p, i) => ({ ...p, i })).filter((p) => !p.completado);
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

function anunciar(msg) {
  const a = $('anuncio');
  a.textContent = '';
  setTimeout(() => { a.textContent = msg; }, 50);
}

function pintarGuardado() {
  $('guardado').textContent = s.guardadoEn ? '● Guardado ' + hora(s.guardadoEn) : '';
}

// ---------- Navegación (foco al título: RNF-01) ----------
const pantallas = { inicio: 'p-inicio', sesion: 'p-sesion', revision: 'p-revision', cerrada: 'p-cerrada' };
let actual = 'inicio';

function irA(nombre, enfocar = true) {
  actual = nombre;
  for (const [k, id] of Object.entries(pantallas)) $(id).hidden = k !== nombre;
  const migas = { inicio: 'Sesiones', sesion: 'Sesiones › P-07', revision: 'Sesiones › P-07 › Revisión', cerrada: 'Sesiones › P-07 › Cerrada' };
  $('migas').textContent = migas[nombre];
  if (nombre === 'inicio') renderInicio();
  if (nombre === 'sesion') renderSesion();
  if (nombre === 'revision') renderRevision();
  if (nombre === 'cerrada') renderCerrada();
  if (enfocar) $(pantallas[nombre]).querySelector('h1').focus();
}

// ---------- Inicio (RF-02) ----------
function renderInicio() {
  const est = s.cerrada
    ? '<span class="badge cerrada">✓ Cerrada · verificada</span>'
    : '<span class="badge interrumpida">⚠ Interrumpida</span>';
  const detalle = s.cerrada
    ? `Cerrada el ${fecha(s.cierre.en)} a las ${hora(s.cierre.en)} · código ${s.cierre.codigo}`
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
  const hechos = obligatorios().filter((c) => c.hecho).length;
  const msg = `Recuperamos ${completados()} pasos completados y ${hechos} de ${obligatorios().length} ítems obligatorios. Continúas en el paso ${pasoSel + 1}: ${s.pasos[pasoSel].nombre}.`;
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

function mostrarErrores(faltan, pasos) {
  const total = faltan.length + pasos.length;
  $('error').innerHTML = `
    <h2>No se puede cerrar la sesión todavía</h2>
    <p>Faltan ${total} elemento${total > 1 ? 's' : ''}. Tus datos están guardados.</p>
    <ul>
      ${pasos.map((p) => `<li><a href="#" data-ir-paso="${p.i}">Paso ${p.i + 1}: ${p.nombre} (sin completar)</a></li>`).join('')}
      ${faltan.map((c) => `<li><a href="#" data-ir-check="${c.id}">${c.texto} (obligatorio)</a></li>`).join('')}
    </ul>`;
  $('error').hidden = false;
  renderChecklist(true);
  $('error').focus();
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

$('b-volver-sesion').addEventListener('click', () => irA('sesion'));
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

  setTimeout(() => {
    const esperado = huella(s);
    const ahora = new Date().toISOString();
    s.cerrada = true;
    s.cierre = { codigo: esperado, en: ahora };
    let ok = false;
    try {
      if (SIMULAR_FALLO) throw new Error('fallo simulado');
      localStorage.setItem(CLAVE, JSON.stringify({ ...s, guardadoEn: ahora }));
      const leido = leerGuardado();
      ok = !!leido && leido.cerrada && huella(leido) === esperado && leido.cierre.codigo === esperado;
    } catch (e) { ok = false; }

    b.disabled = false;
    b.classList.remove('girando');
    b.textContent = 'Confirmar cierre';
    b.removeAttribute('aria-busy');

    if (!ok) {
      // Revertir: la sesión sigue abierta y los datos se conservan en memoria
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
  const d = leerGuardado() || s; // el resumen se construye con lo releído, no con la memoria
  $('codigo').textContent = d.cierre.codigo;
  $('cerrada-en').textContent = `Cerrada el ${fecha(d.cierre.en)} a las ${hora(d.cierre.en)}`;
  const nombres = obligatorios(d).filter((c) => c.hecho).map((c) => c.texto).join(', ');
  $('resumen').innerHTML = `
    <h2>Resumen comprobable</h2>
    <dl>
      <dt>Pasos</dt><dd>${completados(d)} de ${d.pasos.length} completados</dd>
      <dt>Checklist obligatorio</dt><dd>${obligatorios(d).filter((c) => c.hecho).length} de ${obligatorios(d).length} ✓ (${esc(nombres)})</dd>
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
  const ok = !!d && d.cerrada && huella(d) === d.cierre.codigo;
  $('verif').textContent = ok
    ? `✓ Coincide: lo guardado produce el código ${d.cierre.codigo} (${hora(new Date().toISOString())}).`
    : '✕ No coincide: el registro guardado cambió o no existe. Revisa la sesión.';
  $('verif').className = 'verif ' + (ok ? 'ok' : 'mal');
});

$('b-volver').addEventListener('click', () => irA('inicio'));

// Escape: volver un nivel (RNF-01)
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (actual === 'revision') irA('sesion');
  else if (actual === 'sesion' || actual === 'cerrada') irA('inicio');
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
