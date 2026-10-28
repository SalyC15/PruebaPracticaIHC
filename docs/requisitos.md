# Fase 2 · Requisitos verificables

Formato: *ID — enunciado — criterio de verificación (cómo se comprueba en el prototipo)*.

| ID | Requisito | Criterio de verificación | Origen |
|---|---|---|---|
| **RF-01** | El sistema conserva automáticamente los pasos finalizados, el checklist y las observaciones de una sesión interrumpida. | Marcar pasos 1–3, recargar el navegador (F5) → los 3 pasos siguen como "Completado". | Restricción de la tarjeta · F2 |
| **RF-02** | Al retomar, el Dashboard indica la sesión interrumpida, el paso en que quedó y la hora del último guardado, y anuncia lo recuperado. | La tarjeta de Inicio muestra "Interrumpida · paso 4 de 6 · guardado HH:MM"; al pulsar "Retomar" se anuncia "Recuperamos 3 pasos completados…" (región `aria-live`). | F2 · MdV 1 |
| **RF-03** | El checklist separa visualmente y con texto los ítems **obligatorios** de los opcionales, con contador "n de N obligatorios". | Cada obligatorio tiene la etiqueta "Obligatorio" (no solo color o asterisco); el contador se actualiza al marcar. | F3 · Gestalt |
| **RF-04** | La sesión solo puede pasar a "Cerrada" cuando todos los ítems obligatorios están verificados (y, desde v2, los 6 pasos del Stepper están completados). | Con 1 obligatorio o 1 paso pendiente, "Cerrar sesión" nunca muestra el estado de éxito. | Fallo de la tarjeta · F1 |
| **RF-05** | Si se intenta cerrar con pendientes, se muestra un error que nombra cada ítem faltante y permite ir a él (rama de error/editar) sin perder datos. | El mensaje lista los pendientes; cada enlace lleva el foco a su casilla; los datos siguen intactos. | F1 · F3 |
| **RF-06** | **Incidencia Dashboard UX (`IHC-A-12`):** Antes de cerrar se muestra una **revisión previa** editable y, tras cerrar, un **resumen comprobable** (pasos, checklist, observaciones, código de verificación FNV-1a y hora); el éxito solo se anuncia si el guardado se verificó. | Pantalla Revisión con "Editar" por sección; en la confirmación e Inicio, `estaVerificada()` + `huella()` comprueban la integridad. Con `?fallo=1` se muestra error, no éxito. | Incidencia sorpresa Dashboard UX (#4) |
| **RF-07 (`R7`)** | **Incidencia CaféU (`IHC-A-01`):** Al editar la cantidad de un producto (de 1 a 2 cafés), el sistema actualiza subtotales y total en vivo (`USD 4,25` → `USD 6,75`), identifica la diferencia (`+USD 2,50`) y exige una nueva revisión antes de habilitar la confirmación del pedido. | Modificar de 1 a 2 cafés → muestra diferencia `+USD 2,50` y nuevo total `USD 6,75`; el botón "Confirmar pedido" permanece deshabilitado hasta pulsar "Revisar y aceptar nuevo total". | Incidencia sorpresa CaféU (#9) |

## Requisitos no funcionales transversales

| ID | Requisito | Verificación |
|---|---|---|
| RNF-01 | Operable solo con teclado (Tab, Shift+Tab, Enter, Espacio, Escape) con foco visible. | Recorrido completo sin ratón. |
| RNF-02 | El estado del paso activo no depende solo del color (texto "Actual", `aria-current="step"`). | Lectura con lector de pantalla / escala de grises (`IHC-A-10`). |
| RNF-03 | Feedback de estado en ≤ 1 s: "Guardando…", "Guardado HH:MM", "Cerrando…". | Observación en la prueba. |
| RNF-04 | Diseño usable a 360 px y 320 px de ancho manteniendo la jerarquía y anonimato de participantes (`P-07`). | DevTools 360 px / Vista 320 px (`IHC-A-11`, `IHC-A-09`). |
