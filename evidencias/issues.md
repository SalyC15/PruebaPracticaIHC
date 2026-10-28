# Issues del proyecto (texto listo para crear en GitHub)

> Crear cada Issue en https://github.com/SalyC15/PruebaPracticaIHC/issues y **asignarlo** al integrante responsable. Al cerrar, completar "Decisión de cierre" con el enlace al commit/PR.

---

## #1 · [F1] Estado "Completado" sin comprobar checklist obligatorio (éxito falso)

- **Hallazgo:** al pulsar "Cerrar sesión" el Dashboard marca la sesión como completada aunque falten ítems obligatorios (consentimiento, grabación, SUS).
- **Severidad:** 4 — Catastrófico (Nielsen #1, #5).
- **Responsable:** Alison Marcela Cobos Taco (@Itsuna18)
- **Reproducción:**
  1. Abrir la sesión P-07 con el checklist incompleto.
  2. Pulsar "Cerrar sesión".
  3. Resultado: aparece "Completado". Esperado: bloqueo con la lista de pendientes.
- **Requisito/flujo:** RF-04, RF-05 · rama de error del user flow.
- **Decisión de cierre:** v1 bloquea el cierre si hay obligatorios pendientes. Resuelto en rama `feat/diagnostico` y mergeado a `main`.

## #2 · [F2] Al retomar no se ven los pasos ya finalizados

- **Hallazgo:** al volver a la sesión interrumpida no hay evidencia de qué pasos se conservaron ni cuándo se guardó por última vez.
- **Severidad:** 3 — Grave (Nielsen #6; carga cognitiva de memoria de trabajo).
- **Responsable:** Melany Saleth Cevallos Goyes (@SalyC15)
- **Reproducción:** marcar los pasos 1–3, recargar la página → no hay indicación del progreso recuperado.
- **Requisito/flujo:** RF-01, RF-02 · rama principal (Retomar).
- **Decisión de cierre:** persistencia en `localStorage`, Stepper con estados y aviso "Recuperamos N pasos". Resuelto en rama `feat/arquitectura`.

## #3 · [F3] Obligatorios y opcionales tienen el mismo aspecto

- **Hallazgo:** solo un asterisco distingue los ítems obligatorios; en el error no se indica cuáles faltan.
- **Severidad:** 2 — Menor (Gestalt: similitud / región común).
- **Responsable:** Carlos Giovanni Ramos Jácome (@carlitosgiovanniramos)
- **Reproducción:** abrir el checklist y pedir a alguien que diga cuáles son obligatorios.
- **Requisito/flujo:** RF-03, RF-05.
- **Decisión de cierre:** v2 agrupa los obligatorios en su propia región, añade la etiqueta textual "Obligatorio" y un resumen de errores con enlaces que llevan el foco a cada pendiente. Resuelto en rama `feat/prototipo`.

## #4 · [Incidencia sorpresa] Añadir revisión previa y resumen comprobable; evitar éxito falso

- **Hallazgo (docente, min. 100):** el cierre debe pasar por una revisión previa y terminar en un resumen comprobable; nunca anunciar éxito sin verificar.
- **Severidad:** 4 — Catastrófico.
- **Responsable:** Henry Daniel Lagua Flores (@Hlagua)
- **Reproducción:** en v2 previa, cerrar la sesión → no hay pantalla de revisión y la confirmación no se puede verificar.
- **Requisito/flujo:** RF-06 (nuevo) · nodos "Revisión previa" y "Verificar guardado" del user flow.
- **Decisión de cierre:** pantalla de Revisión previa con "Editar" por sección; el cierre relee lo guardado y compara un código de verificación; si no coincide → error y los datos se conservan. Resuelto en rama `feat/prueba-incidencia`.
