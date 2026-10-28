# Matriz de trazabilidad

Requisito → nodo del flujo → pantalla → componente → wireframe → implementación.

| Requisito | Nodo del user flow | Pantalla | Componente | Wireframe | Implementación (prototipo v1 / v2) | Issue |
|---|---|---|---|---|---|---|
| RF-01 Conservar progreso | D1 "¿Pasos 1–3 completados?" | Sesión | Indicador "Guardado HH:MM", Stepper | `wireframes/w1-inicio.svg`, `w2-accion-sesion.svg` | v1 y v2: `app.js` → `guardar()`, `cargar()` / `leerGuardado()` (localStorage) | #2 |
| RF-02 Retomar con aviso | P1 → P2 "Retomar" (y E0 reintentar) | Inicio, Sesión | Card UI de sesión, región `aria-live` | `w1-inicio.svg` | v1 y v2: `app.js` → `renderInicio()`, `retomar()`, `anunciar()` | #2 |
| RF-03 Obligatorio vs opcional | A2 "Marcar checklist" | Sesión | Checklist Grid en dos regiones + contador | `w2-accion-sesion.svg` | v1: lista con asterisco `*` · v2: `renderChecklist()` con `<fieldset>` y etiqueta "Obligatorio" | #3 |
| RF-04 Bloquear éxito falso | D2 "¿Obligatorios verificados?" | Sesión | Botón "Cerrar sesión" con validación | `w3-error-pendientes.svg` | v1 y v2: `app.js` → `pendientesObligatorios()`, `intentarCerrar()` | #1 |
| RF-05 Error con pendientes | E1 → rama editar | Sesión (estado error) | Resumen de errores con enlaces y foco | `w3-error-pendientes.svg` | v1: banner genérico en `intentarCerrar()` · v2: `mostrarErrores()` y `actualizarBannerErrores()` con enlaces al foco | #1, #3 |
| RF-06 Revisión + resumen comprobable (Dashboard UX · `IHC-A-12`) | P3, D3, A4, D4, E2, P4 | Revisión, Confirmación | Resumen por secciones, "Editar", código de verificación | `w4-confirmacion.svg` | v1: no aplica (cierre directo) · v2: `renderRevision()`, `confirmarCierre()`, `huella()`, `estaVerificada()` | #4 |
| RF-07 (`R7`) Recálculo de total y nueva revisión al editar (CaféU · `IHC-A-01`) | Rama Editar CaféU: `C2 → C3 → D_Rev → C4` | Inicio / Simulador CaféU (`#p-tarjeta`) | Input cantidad (`#sim01-cant`), banner de diferencia (`+USD 2,50`), botón `#sim01-revisar` y `#sim01-confirmar` | `w4-confirmacion.svg` (sección revisión) | v2: `app.js` → `montarSimuladorInteractivo('IHC-A-01')`, `abrirTarjetaDetalle('IHC-A-01')` | #9 |
| RNF-01 Teclado / foco | Todos | Todas | Botones nativos, `:focus-visible`, foco en `h1` al cambiar de pantalla, Escape = volver (ignorado en inputs) | — | v1 y v2: `app.js` → `irA()`, listener `keydown` (`Escape`) | — |
| RNF-02 Estado sin depender del color | Stepper | Sesión | Texto "Completado/Actual/Pendiente", `aria-current="step"`, modo escala de grises | `w2-accion-sesion.svg` | v1 y v2: `app.js` → `renderStepper()`, `#b-toggle-grises` | — |
| RNF-03 Feedback de estado ≤ 1 s | A1, A2, A4 | Todas | Indicador `● Guardado HH:MM`, botón `Cerrando…` (`aria-busy="true"`), anuncios `aria-live` | `w2-accion-sesion.svg` | v1 y v2: `app.js` → `pintarGuardado()`, `anunciar()`, `intentarCerrar()` / `confirmarCierre()` | — |
| RNF-04 Diseño responsivo (360 px / 320 px) y privacidad (`P-07`) | Todos | Todas | Grid adaptable (`.columnas` 1 col, `.stepper` 1–3 cols en móvil) + `#f-participante` anónimo | `w1`–`w4` | v1 y v2: `styles.css` + `sanitizarCodigoAnonimo()` en `app.js` | — |
