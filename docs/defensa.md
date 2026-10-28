# Fase 5 · Incidencia sorpresa y defensa

## Incidencia recibida (minuto 100)

> "Añadir revisión previa y resumen comprobable; evitar éxito falso."

| Paso | Qué se hizo | Evidencia |
|---|---|---|
| 1. Issue | Se abrió el **#4** con severidad 4, responsable y reproducción. | `evidencias/issues.md` |
| 2. Requisito | Nuevo **RF-06**; RF-04 ampliado (también exige los 6 pasos). | `docs/requisitos.md` |
| 3. Flujo | Nodos *Revisión previa*, *¿Todo correcto?*, *¿Guardado verificado?* y rama *Error de guardado*. | `diagramas/user-flow.md` |
| 4. Prototipo | Pantalla Revisión con "Editar" por sección; `confirmarCierre()` guarda, **relee** y compara `huella()`; si no coincide → error y la sesión sigue abierta; la Confirmación se construye con lo releído y "Comprobar de nuevo" recalcula. | `prototipo/v2/app.js` |
| 5. Prueba | Ruta normal → "✓ Coincide"; `?fallo=1` → "No se pudo confirmar el cierre", la sesión sigue abierta. | `evidencias/capturas/v2-confirmacion-escritorio.png`, `v2-fallo-guardado-escritorio.png` |
| 6. Commit | Commit posterior a la entrega: `feat(incidencia): revision previa editable y cierre verificado huella (#4)` | Enlace en commit final de la rama `feat/prueba-incidencia` |

## Respuesta a la pregunta individual

**¿Cómo muestra el momento de verdad y comprueba el estado final?**

- **Momento de verdad (MdV 2, cerrar):** el sistema no salta a "Completado". Primero valida (RF-04); si falta algo, lo nombra y lleva el foco a cada pendiente (RF-05). Si todo está, muestra una **Revisión previa** donde la investigadora ve qué se va a cerrar y puede editar.
- **Comprobación del estado final:** al confirmar se guarda, se **relee** del almacenamiento y se calcula un código (`huella()`, FNV-1a sobre pasos y checklist). Solo si lo releído coincide se anuncia "cerrada y verificada" y se muestra el código. El resumen se construye con los datos releídos, no con la memoria, y "Comprobar de nuevo" permite verificarlo en cualquier momento. Con un fallo de guardado (`?fallo=1`) se muestra error, no éxito.

## Guion de demostración (sin guía)

1. **Ruta normal:** Retomar → completar pasos → marcar obligatorios → Revisar → Confirmar → Comprobar de nuevo.
2. **Ruta de error:** cerrar con pendientes → lista → enlace → foco en la casilla.
3. **Requisito en código:** RF-04 → `intentarCerrar()` y `pendientesObligatorios()` en `prototipo/v2/app.js`.
4. **Mejora vinculada al Issue:** #3 → `renderChecklist()` y `mostrarErrores()` (comparar `v1-error-360.png` con `v2-error-360.png`).
5. **Cambio en vivo sugerido:** cambiar el texto del error, el retardo de "Cerrando…" (1000 ms) o el destino del foco en `mostrarErrores()`.

## Contribución por integrante

| Integrante | Usuario GitHub | Rama | Issue | Entregables | PR revisado |
|---|---|---|---|---|---|
| Alison Marcela Cobos Taco | @Itsuna18 | `feat/diagnostico` | #1 | `docs/diagnostico.md`, curva, `evidencias/issues.md` | PR de Melany Cevallos (`feat/arquitectura`) |
| Melany Saleth Cevallos Goyes | @SalyC15 | `feat/arquitectura` | #2 | requisitos, sitemap, user flow, trazabilidad, wireframes | PR de Carlos Ramos (`feat/prototipo`) |
| Carlos Giovanni Ramos Jácome | @carlitosgiovanniramos | `feat/prototipo` | #3 | `prototipo/v1`, `prototipo/v2` (corrección Fase 4), `docs/decisiones.md` | PR de Henry Lagua (`feat/prueba-incidencia`) |
| Henry Daniel Lagua Flores | @Hlagua | `feat/prueba-incidencia` | #4 | `pruebas/sesion.md`, incidencia en v2, capturas, `docs/defensa.md` | PR de Alison Cobos (`feat/diagnostico`) |
