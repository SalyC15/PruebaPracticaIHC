# Issues del proyecto (Fase 1 · Diagnóstico inicial)

> Registrados en https://github.com/SalyC15/PruebaPracticaIHC/issues con asignación por integrante y pasos de reproducción.

---

## #1 · [F1] Estado 'Completado' sin comprobar checklist obligatorio (éxito falso)

- **Hallazgo:** al pulsar "Cerrar sesión" el Dashboard marca la sesión como completada aunque falten ítems obligatorios (consentimiento, grabación, SUS).
- **Severidad:** 4 — Catastrófico (Nielsen #1, #5).
- **Responsable:** Alison Marcela Cobos Taco (@Itsuna18)
- **Reproducción:**
  1. Abrir la sesión P-07 con el checklist incompleto.
  2. Pulsar "Cerrar sesión".
  3. Resultado: aparece "Completado". Esperado: bloqueo indicando pendientes.
- **Requisito/flujo:** RF-04, RF-05 · rama de error del user flow.
- **Estado:** Abierto en Fase 1 (pendiente de implementación en prototipo).

## #2 · [F2] Al retomar no se ven los pasos ya finalizados

- **Hallazgo:** al volver a la sesión interrumpida no hay evidencia de qué pasos se conservaron ni cuándo se guardó por última vez.
- **Severidad:** 3 — Grave (Nielsen #6; carga cognitiva de memoria de trabajo).
- **Responsable:** Melany Saleth Cevallos Goyes (@SalyC15)
- **Reproducción:** marcar los pasos 1–3, recargar la página → no hay indicación del progreso recuperado.
- **Requisito/flujo:** RF-01, RF-02 · rama principal (Retomar).
- **Estado:** Abierto en Fase 1 (pendiente de arquitectura y persistencia).

## #3 · [F3] Obligatorios y opcionales tienen el mismo aspecto

- **Hallazgo:** solo un asterisco distingue los ítems obligatorios; en el error no se indica cuáles faltan.
- **Severidad:** 2 — Menor (Gestalt: similitud / región común).
- **Responsable:** Carlos Giovanni Ramos Jácome (@carlitosgiovanniramos)
- **Reproducción:** abrir el checklist y pedir a alguien que diga cuáles son obligatorios.
- **Requisito/flujo:** RF-03, RF-05.
- **Estado:** Abierto en Fase 1 (pendiente de evaluación en prueba cognitiva).