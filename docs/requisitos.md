# Fase 2 · Requisitos verificables

Formato: *ID — enunciado — criterio de verificación (cómo se comprueba en el prototipo)*.

| ID | Requisito | Criterio de verificación | Origen |
|---|---|---|---|
| **RF-01** | El sistema conserva automáticamente los pasos finalizados, el checklist y las observaciones de una sesión interrumpida. | Marcar pasos 1–3, recargar el navegador (F5) → los 3 pasos siguen como "Completado". | Restricción de la tarjeta · F2 |
| **RF-02** | Al retomar, el Dashboard indica la sesión interrumpida, el paso en que quedó y la hora del último guardado, y anuncia lo recuperado. | La tarjeta de Inicio muestra "Interrumpida · paso 4 de 6 · guardado HH:MM"; al pulsar "Retomar" se anuncia "Recuperamos 3 pasos completados…" (región `aria-live`). | F2 · MdV 1 |
| **RF-03** | El checklist identifica los ítems **obligatorios** frente a los opcionales para orientar el cierre de la sesión. | Los 4 ítems obligatorios están señalizados en la lista de verificación. | F3 · Gestalt |
| **RF-04** | La sesión solo puede pasar a "Cerrada" cuando todos los ítems obligatorios y los 6 pasos del Stepper están completados. | Con 1 obligatorio o 1 paso pendiente, "Cerrar sesión" nunca muestra el estado de éxito. | Fallo de la tarjeta · F1 |
| **RF-05** | Si se intenta cerrar con pendientes, se muestra un mensaje de error en pantalla que impide el cierre y permite volver a editar sin perder datos. | El banner de error recibe el foco; los datos registrados siguen intactos. | F1 · F3 |
| **RF-06** | Tras completar y validar la sesión, se presenta una pantalla de confirmación con el resumen de pasos completados, checklist obligatorio y hora de cierre. | La pantalla de Confirmación muestra sesión, pasos (6 de 6), obligatorios (4 de 4) y fecha/hora. | MdV 2 · Principio CaféU |

## Requisitos no funcionales transversales

| ID | Requisito | Verificación |
|---|---|---|
| RNF-01 | Operable solo con teclado (Tab, Shift+Tab, Enter, Espacio, Escape) con foco visible. | Recorrido completo sin ratón. |
| RNF-02 | El estado del paso activo no depende solo del color (texto "Actual", `aria-current="step"`). | Lectura con lector de pantalla / escala de grises. |
| RNF-03 | Feedback de estado en ≤ 1 s: "Guardando…", "Guardado HH:MM", "Cerrando…". | Observación en la prueba. |
| RNF-04 | Diseño usable a 360 px de ancho manteniendo la jerarquía. | DevTools 360 px. |
