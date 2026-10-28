# Fase 2 · Requisitos verificables

Formato: *ID — enunciado — criterio de verificación (cómo se comprueba en el prototipo)*.

| ID | Requisito | Criterio de verificación | Origen |
|---|---|---|---|
| **RF-01** | El sistema conserva automáticamente los pasos finalizados, el checklist y las observaciones de una sesión interrumpida. | Marcar pasos 1–3, recargar el navegador (F5) → los 3 pasos siguen como "Completado". | Restricción de la tarjeta · F2 |
| **RF-02** | Al retomar, el Dashboard indica la sesión interrumpida, el paso en que quedó y la hora del último guardado, y anuncia lo recuperado. | La tarjeta de Inicio muestra "Interrumpida · paso 4 de 6 · guardado HH:MM"; al pulsar "Retomar" se anuncia "Recuperamos 3 pasos completados…" (región `aria-live`). | F2 · MdV 1 |
| **RF-03** | El checklist separa visualmente y con texto los ítems **obligatorios** de los opcionales, con contador "n de N obligatorios". | Cada obligatorio tiene la etiqueta "Obligatorio" (no solo color o asterisco); el contador se actualiza al marcar. | F3 · Gestalt |
| **RF-04** | La sesión solo puede pasar a "Cerrada" cuando todos los ítems obligatorios están verificados (y, desde v2, los 6 pasos del Stepper están completados). | Con 1 obligatorio o 1 paso pendiente, "Cerrar sesión" nunca muestra el estado de éxito. | Fallo de la tarjeta · F1 |
| **RF-05** | Si se intenta cerrar con pendientes, se muestra un error que nombra cada ítem faltante y permite ir a él (rama de error/editar) sin perder datos. | El mensaje lista los pendientes; cada enlace lleva el foco a su casilla; los datos siguen intactos. | F1 · F3 |
| **RF-06** | Antes de cerrar se muestra una **revisión previa** editable y, tras cerrar, un **resumen comprobable** (pasos, checklist, observaciones, código de verificación y hora); el éxito solo se anuncia si el guardado se verificó. | Pantalla Revisión con "Editar" por sección; en la confirmación, "Comprobar de nuevo" recalcula el código desde lo guardado y coincide. Con `?fallo=1` se muestra error, no éxito. | Incidencia sorpresa (#4) |

## Requisitos no funcionales transversales

| ID | Requisito | Verificación |
|---|---|---|
| RNF-01 | Operable solo con teclado (Tab, Shift+Tab, Enter, Espacio, Escape) con foco visible. | Recorrido completo sin ratón. |
| RNF-02 | El estado del paso activo no depende solo del color (texto "Actual", `aria-current="step"`). | Lectura con lector de pantalla / escala de grises. |
| RNF-03 | Feedback de estado en ≤ 1 s: "Guardando…", "Guardado HH:MM", "Cerrando…". | Observación en la prueba. |
| RNF-04 | Diseño usable a 360 px de ancho manteniendo la jerarquía. | DevTools 360 px. |
