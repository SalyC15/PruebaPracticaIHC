# Matriz de trazabilidad

Requisito → nodo del flujo → pantalla → componente → wireframe → implementación.

| Requisito | Nodo del user flow | Pantalla | Componente | Wireframe | Implementación (prototipo) | Issue |
|---|---|---|---|---|---|---|
| RF-01 Conservar progreso | D1 "¿Pasos 1–3 completados?" | Sesión | Indicador "Guardado HH:MM", Stepper | `wireframes/w1-inicio.svg`, `w2-sesion.svg` | `app.js` → `guardar()` / `cargar()` (localStorage) | #2 |
| RF-02 Retomar con aviso | P1 → P2 "Retomar" | Inicio, Sesión | Card UI de sesión, región `aria-live` | `w1-inicio.svg` | `app.js` → `renderInicio()`, `retomar()` | #2 |
| RF-03 Obligatorio vs opcional | A2 "Marcar checklist" | Sesión | Checklist Grid en dos regiones + contador | `w2-sesion.svg` | `app.js` → `renderChecklist()` | #3 |
| RF-04 Bloquear éxito falso | D2 "¿Obligatorios verificados?" | Sesión | Botón "Cerrar sesión" con validación | `w3-error.svg` | `app.js` → `pendientesObligatorios()`, `intentarCerrar()` | #1 |
| RF-05 Error con pendientes | E1 → rama editar | Sesión (estado error) | Resumen de errores con enlaces y foco | `w3-error.svg` | v1: banner genérico · v2: `mostrarErrores()` con enlaces | #1, #3 |
| RF-06 Revisión + resumen comprobable | P3, D3, A4, D4, E2, P4 | Revisión, Confirmación | Resumen por secciones, "Editar", código de verificación | `w4-confirmacion.svg` | v2: `renderRevision()`, `confirmarCierre()`, `huella()` | #4 |
| RNF-01 Teclado / foco | Todos | Todas | Botones nativos, `:focus-visible`, foco en `h1` al cambiar de pantalla, Escape = volver | — | `app.js` → `irA()` | — |
| RNF-02 Estado sin depender del color | Stepper | Sesión | Texto "Completado/Actual/Pendiente", `aria-current` | `w2-sesion.svg` | `renderStepper()` | — |
