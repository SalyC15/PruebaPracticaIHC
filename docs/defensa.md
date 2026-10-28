# Fase 5 · Incidencias sorpresa (1 por caso base: Dashboard UX y CaféU) y Defensa

Siguiendo la instrucción del docente (*"hacer una incidencia por caso: una incidencia de CaféU y otra de Dashboard UX, con su respectivo Issue"*), se resolvieron e integraron de forma completa:

1. **Caso Dashboard UX → Tarjeta `IHC-A-12 · Finalización prematura`** ([Issue #4](https://github.com/SalyC15/PruebaPracticaIHC/issues/4))
2. **Caso CaféU → Tarjeta `IHC-A-01 · Precio cambia al editar`** ([Issue #9](https://github.com/SalyC15/PruebaPracticaIHC/issues/9))

---

## 1. Incidencia Caso Dashboard UX (`IHC-A-12 · Finalización prematura` · Issue #4)

> **Evento imprevisto:** "El sistema marca finalizada una sesión aunque falta un requisito del checklist."
> **Cambio obligatorio:** "Impedir finalización falsa, explicar elemento pendiente y permitir completarlo sin borrar datos."

| Paso | Qué se hizo | Evidencia |
|---|---|---|
| 1. Issue | Se abrió el **[Issue #4](https://github.com/SalyC15/PruebaPracticaIHC/issues/4)** con severidad 4, responsable y reproducción. | `evidencias/issues.md` · [Issue #4](https://github.com/SalyC15/PruebaPracticaIHC/issues/4) |
| 2. Requisito | **RF-06** (revisión previa editable + resumen comprobable con huella FNV-1a). | `docs/requisitos.md`, `docs/trazabilidad.md` |
| 3. Flujo | Nodos *Revisión previa*, *¿Todo correcto?*, *¿Guardado verificado?* y rama *Error de guardado*. | `diagramas/user-flow.md`, `diagramas/sitemap.md` |
| 4. Prototipo | Bloqueo de cierre con lista de pendientes y foco; pantalla Revisión con "Editar" por sección; `confirmarCierre()` guarda, **relee** y valida con `estaVerificada()` y `huella()`; Inicio y Confirmación detectan cualquier alteración posterior. | `prototipo/v2/app.js`, `prototipo/v2/index.html`, `prototipo/v2/styles.css` |
| 5. Prueba | Ruta normal → "✓ Coincide"; `?fallo=1` → "No se pudo confirmar el cierre", la sesión sigue abierta. | `evidencias/capturas/v2-confirmacion-escritorio.png`, `v2-fallo-guardado-escritorio.png`, `v2-revision-escritorio.png` |
| 6. Commit | Commit en `feat/prueba-incidencia` (`Closes #4, Closes #9`) e integración en `main` (`PR #8`). | [Rama `feat/prueba-incidencia`](https://github.com/SalyC15/PruebaPracticaIHC/tree/feat/prueba-incidencia) · [PR #8](https://github.com/SalyC15/PruebaPracticaIHC/pull/8) |

### Respuesta a la pregunta de defensa (`IHC-A-12`)
**¿Cómo muestra el momento de verdad y comprueba el estado final?**
- **Momento de verdad (`MdV 2`, cerrar):** El sistema nunca salta directo a *"Completado"*. Primero valida los 6 pasos y los 4 obligatorios (`RF-04`); si falta algo, bloquea el cierre, conserva los datos y muestra la lista interactiva de pendientes que lleva el foco a cada casilla (`RF-05`). Cuando todo está completo, muestra la **Revisión previa editable**.
- **Comprobación del estado final (`estaVerificada()` + `huella()`):** Al confirmar, se escribe en `localStorage`, se **relee** desde el almacenamiento y se compara el hash FNV-1a (`huella()`) con `s.cierre.codigo`. Tanto en Inicio (`renderInicio()`) como en Confirmación (`renderCerrada()`), si alguien modifica `localStorage` después de cerrar, el sistema detecta que la huella no coincide y muestra `✕ Cerrada · NO verificada` en vez de un éxito falso.

---

## 2. Incidencia Caso CaféU (`IHC-A-01 · Precio cambia al editar` · Issue #9)

> **Evento imprevisto:** "Tras modificar de 1 a 2 cafés, la pantalla conserva USD 4,25 aunque el total real cambia."
> **Cambio obligatorio:** "Implementar actualización de subtotales y total, identificar diferencia, pedir nueva revisión antes de confirmar."

| Paso | Qué se hizo | Evidencia |
|---|---|---|
| 1. Issue | Se abrió el **[Issue #9](https://github.com/SalyC15/PruebaPracticaIHC/issues/9)** asignado al equipo con pasos de reproducción y decisión de cierre. | `evidencias/issues.md` · [Issue #9](https://github.com/SalyC15/PruebaPracticaIHC/issues/9) |
| 2. Requisito | Nuevo requisito **RF-07 (`R7`)** en requisitos y matriz de trazabilidad. | `docs/requisitos.md`, `docs/trazabilidad.md` |
| 3. Flujo | Actualización de la **rama de editar** en `diagramas/user-flow.md` (sección 2: recálculo reactivo y nodo `¿Nuevo total revisado y aceptado?`). | `diagramas/user-flow.md` |
| 4. Prototipo | Tarjeta principal de CaféU en el Inicio de `prototipo/v2/` (`#b-abrir-cafeu` y `?tarjeta=IHC-A-01`): al cambiar de 1 a 2 cafés actualiza subtotal (`USD 2,50` → `USD 5,00`), muestra diferencia (`+USD 2,50`) y nuevo total (`USD 6,75`), y bloquea *"Confirmar pedido"* hasta pulsar *"1. Revisar y aceptar nuevo total"*. | `prototipo/v2/app.js` (`montarSimuladorInteractivo('IHC-A-01')`) |

### Respuesta a la pregunta de defensa (`IHC-A-01`)
**¿Qué parte de la rama de editar del user flow se modifica?**
- En la **rama de editar cantidades** (`diagramas/user-flow.md`), cuando el usuario cambia la cantidad de cafés (de 1 a 2), el flujo ya no regresa directo al botón de confirmación. Se insertan dos pasos obligatorios:
  1. **Nodo de proceso `Recálculo reactivo (RF-07 / R7)`:** recalcula en vivo el subtotal del ítem (`USD 5,00`), calcula la diferencia respecto al total previo (`+USD 2,50`) y actualiza el nuevo total real (`USD 6,75`), invalidando la revisión anterior (`revisado = false`).
  2. **Rombo de decisión `¿Nuevo total revisado y aceptado por el usuario?`:** mantiene deshabilitado el botón `Confirmar pedido` hasta que el usuario pulsa explícitamente `Revisar y aceptar nuevo total (USD 6,75)`.

---

## Guion de demostración rápida (ambas incidencias)

1. **Incidencia Dashboard UX (`IHC-A-12` · Issue #4):** En Inicio pulsar *Retomar* → intentar cerrar con pendientes (ver bloqueo y foco) → completar pasos 4–6 y obligatorios → *Revisar y cerrar* → *Confirmar cierre* → verificar huella FNV-1a.
2. **Incidencia CaféU (`IHC-A-01` · Issue #9):** En Inicio pulsar *Probar Incidencia CaféU (IHC-A-01)* → cambiar cantidad de cafés de `1` a `2` → observar cambio de `USD 4,25` a `USD 6,75` (`+USD 2,50`) y botón *Confirmar* bloqueado → pulsar *1. Revisar y aceptar nuevo total* → pulsar *2. Confirmar pedido*.

## Contribución por integrante

| Integrante | Usuario GitHub | Rol | Rama | Issue | Entregables en Git | PR revisado |
|---|---|---|---|---|---|---|
| Alison Marcela Cobos Taco | `@Itsuna18` | Back-End | `feat/diagnostico` | #1 | `docs/diagnostico.md`, `evidencias/curva-antes.svg`, `evidencias/issues.md` (Fase 1) | PR de Melany (`#6`) |
| Melany Saleth Cevallos Goyes | `@SalyC15` | Front-End | `feat/arquitectura` | #2, #9 | `docs/requisitos.md`, `diagramas/`, `docs/trazabilidad.md`, `wireframes/` (Fase 2) + flujo CaféU `IHC-A-01` | PR de Alison (`#5`) |
| Carlos Giovanni Ramos Jácome | `@carlitosgiovanniramos` | Tester | `feat/prototipo` | #3 | `prototipo/v1/`, `docs/decisiones.md`, `pruebas/sesion.md`, corrección v2 de Fase 4 y capturas v1/v2 | PR de Melany (`#6`) / Henry (`#8`) |
| Henry Daniel Lagua Flores | `@Hlagua` | QA / Arquitecto | `feat/prueba-incidencia` | #4, #9 | Incidencias sorpresa Dashboard UX (`IHC-A-12`, #4) y CaféU (`IHC-A-01`, #9) en `prototipo/v2/`, `docs/defensa.md` y `docs/tarjetas-12-incidencias.md` | PR de Carlos (`#7`) |
