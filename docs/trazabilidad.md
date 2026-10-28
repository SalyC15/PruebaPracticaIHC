# Matriz de trazabilidad

Requisito → nodo del flujo → pantalla → componente → wireframe → implementación.

| Requisito | Nodo del user flow | Pantalla | Componente | Wireframe | Implementación prevista (v1) | Issue |
|---|---|---|---|---|---|---|
| RF-01 Conservar progreso | D1 "¿Pasos 1–3 completados?" | Sesión | Indicador "Guardado HH:MM", Stepper | `wireframes/w1-inicio.svg`, `w2-sesion.svg` | `app.js` → `guardar()` / `cargar()` (localStorage) | #2 |
| RF-02 Retomar con aviso | P1 → P2 "Retomar" (y E0) | Inicio, Sesión | Card UI de sesión, región `aria-live` | `w1-inicio.svg` | `app.js` → `renderInicio()`, `retomar()` | #2 |
| RF-03 Obligatorio vs opcional | A2 "Marcar checklist" | Sesión | Checklist de cierre | `w2-sesion.svg` | `app.js` → `renderChecklist()` | #3 |
| RF-04 Bloquear éxito falso | D2 "¿Obligatorios verificados?" | Sesión | Botón "Cerrar sesión" con validación | `w3-error.svg` | `app.js` → `pendientesObligatorios()`, `intentarCerrar()` | #1 |
| RF-05 Error con pendientes | E1 → rama editar | Sesión (estado error) | Banner de alerta `role="alert"` | `w3-error.svg` | `app.js` → `intentarCerrar()` | #1, #3 |
| RF-06 Confirmación visible | P4 "Confirmación" | Confirmación | Tarjeta de resumen de sesión | `w4-confirmacion.svg` | `app.js` → `renderCerrada()` | — |
| RNF-01 Teclado / foco | Todos | Todas | Botones nativos, `:focus-visible`, foco en `h1`, Escape = volver | — | `app.js` → `irA()`, `keydown` | — |
| RNF-02 Estado sin depender del color | Stepper | Sesión | Texto "Completado/Actual/Pendiente", `aria-current="step"` | `w2-sesion.svg` | `app.js` → `renderStepper()` | — |
| RNF-03 Feedback de estado ≤ 1 s | A1, A2, A3 | Todas | Indicador `● Guardado HH:MM`, botón `Cerrando…` (`aria-busy`) | `w2-sesion.svg` | `app.js` → `pintarGuardado()`, `anunciar()` | — |
| RNF-04 Diseño responsivo a 360 px | Todos | Todas | Grid adaptable en móvil | `w1`–`w4` | `styles.css` → `@media (max-width: 760px)` | — |
