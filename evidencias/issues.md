# Issues del proyecto (trazabilidad y resolución en GitHub)

> Registrados en https://github.com/SalyC15/PruebaPracticaIHC/issues con asignación por integrante, pasos de reproducción y cierre fundamentado. Incluye las **2 incidencias sorpresa seleccionadas (1 por caso base: Dashboard UX `#4` y CaféU `#9`)**.

---

## #1 · [F1] Estado 'Completado' sin comprobar checklist obligatorio (éxito falso)

- **Hallazgo:** al pulsar "Cerrar sesión" el Dashboard marca la sesión como completada aunque falten ítems obligatorios (consentimiento, grabación, SUS).
- **Severidad:** 4 — Catastrófico (Nielsen #1, #5).
- **Responsable:** Alison Marcela Cobos Taco (`@Itsuna18`)
- **Reproducción:**
  1. Abrir la sesión P-07 con el checklist incompleto.
  2. Pulsar "Cerrar sesión".
  3. Resultado: aparece "Completado". Esperado: bloqueo con la lista de pendientes.
- **Requisito/flujo:** RF-04, RF-05 · rama de error del user flow.
- **Decisión de cierre:** Diagnosticado en Fase 1 (`d7d4a56`, rama `feat/diagnostico`), formalizado en requisitos RF-04/RF-05 (`c5f1d47`, rama `feat/arquitectura`) e implementado con bloqueo de validación en prototipo v1 (`6da014d`, rama `feat/prototipo`).
- **Enlace:** Commit [`6da014d`](https://github.com/SalyC15/PruebaPracticaIHC/commit/6da014d) · PR [#5](https://github.com/SalyC15/PruebaPracticaIHC/pull/5) / [#7](https://github.com/SalyC15/PruebaPracticaIHC/pull/7)

## #2 · [F2] Al retomar no se ven los pasos ya finalizados

- **Hallazgo:** al volver a la sesión interrumpida no hay evidencia de qué pasos se conservaron ni cuándo se guardó por última vez.
- **Severidad:** 3 — Grave (Nielsen #6; carga cognitiva de memoria de trabajo).
- **Responsable:** Melany Saleth Cevallos Goyes (`@SalyC15`)
- **Reproducción:** marcar los pasos 1–3, recargar la página → no hay indicación del progreso recuperado.
- **Requisito/flujo:** RF-01, RF-02 · rama principal (Retomar).
- **Decisión de cierre:** Especificado en arquitectura (`c5f1d47`, rama `feat/arquitectura`) y desarrollado con persistencia automática en `localStorage` y Stepper en prototipo v1 (`6da014d`, rama `feat/prototipo`).
- **Enlace:** Commit [`c5f1d47`](https://github.com/SalyC15/PruebaPracticaIHC/commit/c5f1d47) y [`6da014d`](https://github.com/SalyC15/PruebaPracticaIHC/commit/6da014d) · PR [#6](https://github.com/SalyC15/PruebaPracticaIHC/pull/6)

## #3 · [F3] Obligatorios y opcionales tienen el mismo aspecto

- **Hallazgo:** solo un asterisco distingue los ítems obligatorios; en el error no se indica cuáles faltan.
- **Severidad:** 2 — Menor (Gestalt: similitud / región común).
- **Responsable:** Carlos Giovanni Ramos Jácome (`@carlitosgiovanniramos`)
- **Reproducción:** abrir el checklist y pedir a alguien que diga cuáles son obligatorios.
- **Requisito/flujo:** RF-03, RF-05.
- **Decisión de cierre:** Evaluado en la prueba cognitiva (Fase 4) y corregido en prototipo v2 (`bfe5780`, rama `feat/prototipo`), agrupando obligatorios en región común con etiqueta textual y resumen de errores interactivo con foco.
- **Enlace:** Commit [`bfe5780`](https://github.com/SalyC15/PruebaPracticaIHC/commit/bfe5780) · PR [#7](https://github.com/SalyC15/PruebaPracticaIHC/pull/7)

## #4 · [Incidencia sorpresa Dashboard UX · IHC-A-12] Finalización prematura: revisión previa y resumen comprobable; evitar éxito falso

- **Caso base:** Dashboard UX · Tarjeta `IHC-A-12 · Finalización prematura`
- **Evento imprevisto (docente, min. 100):** El sistema marca finalizada una sesión aunque falta un requisito del checklist; el cierre debe pasar por una revisión previa y terminar en un resumen comprobable sin éxito falso.
- **Severidad:** 4 — Catastrófico.
- **Responsable:** Henry Daniel Lagua Flores (`@Hlagua`)
- **Reproducción:** en v2 previa (`bfe5780`), intentar cerrar la sesión P-07 sin revisión previa o alterar `localStorage` tras cerrar.
- **Requisito/flujo:** RF-06 (ampliado) · nodos "Revisión previa" y "Verificar guardado" del user flow.
- **Decisión de cierre:** Implementada pantalla de Revisión previa con botones "Editar" por sección, función `huella()` FNV-1a + `estaVerificada()` para comprobar el estado final en Inicio y Confirmación, y soporte para simular fallo `?fallo=1` en Fase 5 (rama `feat/prueba-incidencia`).
- **Enlace:** [Issue #4](https://github.com/SalyC15/PruebaPracticaIHC/issues/4) · Rama [`feat/prueba-incidencia`](https://github.com/SalyC15/PruebaPracticaIHC/commits/feat/prueba-incidencia) · PR [#8](https://github.com/SalyC15/PruebaPracticaIHC/pull/8)

## #9 · [Incidencia sorpresa CaféU · IHC-A-01] Precio cambia al editar: actualizar subtotales/total y pedir nueva revisión

- **Caso base:** CaféU · Tarjeta `IHC-A-01 · Precio cambia al editar`
- **Evento imprevisto (docente, min. 100):** Tras modificar de 1 a 2 cafés, la pantalla conserva USD 4,25 aunque el total real cambia.
- **Severidad:** 4 — Catastrófico (Nielsen #1, #5).
- **Responsable:** Henry Daniel Lagua Flores (`@Hlagua`) / Melany Saleth Cevallos Goyes (`@SalyC15`)
- **Reproducción:**
  1. Abrir el pedido de CaféU (`1x Café Americano USD 2,50 + 1x Croissant USD 1,75 = USD 4,25`).
  2. Cambiar la cantidad de cafés de `1` a `2`.
  3. Resultado esperado: se actualiza el subtotal de café a `USD 5,00`, se identifica la diferencia (`+USD 2,50`), se muestra el nuevo total real (`USD 6,75`) y se bloquea "Confirmar pedido" hasta pulsar "Revisar y aceptar nuevo total".
- **Requisito/flujo:** `RF-07 (R7)` en `docs/requisitos.md` y `docs/trazabilidad.md` · Rama de edición de CaféU en `diagramas/user-flow.md`.
- **Decisión de cierre:** Implementado el recálculo reactivo de subtotales/total, visualización de diferencia y bloqueo de confirmación hasta nueva revisión en `prototipo/v2/app.js` (`montarSimuladorInteractivo('IHC-A-01')` y acceso directo desde Inicio).
- **Enlace:** [Issue #9](https://github.com/SalyC15/PruebaPracticaIHC/issues/9) · Rama [`feat/prueba-incidencia`](https://github.com/SalyC15/PruebaPracticaIHC/commits/feat/prueba-incidencia) · PR [#8](https://github.com/SalyC15/PruebaPracticaIHC/pull/8)
