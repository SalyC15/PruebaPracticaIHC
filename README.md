# Prueba práctica IHC · Tarjeta IHC-A-12 (+ 12 Tarjetas Interactivas IHC-A-01 a IHC-A-12)

**Universidad Técnica de Ambato · FISEI · Software · IHC · Paralelo A**

| | |
|---|---|
| **Persona** | Investigadora que retoma una prueba de usabilidad interrumpida |
| **Tarea crítica** | Recuperar el checklist y cerrar la sesión |
| **Restricción** | No perder los pasos previamente finalizados |
| **Fallo de la tarjeta** | El estado final aparecía sin comprobar el checklist obligatorio (éxito falso) |
| **Referencias** | [Dashboard UX — HCI_2026_G1](https://github.com/maribelsailema/HCI_2026_G1) (base) · [CaféU — HCI-2026-G2](https://github.com/Sax300-cpu/HCI-2026-G2) (principio confirmar/editar y confirmación visible) |

## Ejecutar el prototipo

```bash
python -m http.server 8012
```

- v1: http://localhost:8012/prototipo/v1/
- v2 (corrección de la prueba + 12 tarjetas e incidencias interactivas): http://localhost:8012/prototipo/v2/
- v2 abriendo directamente cualquier tarjeta (`IHC-A-01` a `IHC-A-12`): `http://localhost:8012/prototipo/v2/?tarjeta=IHC-A-01` (hasta `IHC-A-12`)
- v2 con fallo de guardado simulado: http://localhost:8012/prototipo/v2/?fallo=1

Detalles en [docs/decisiones.md](docs/decisiones.md).

## Estructura

| Ruta | Fase | Contenido |
|---|---|---|
| [docs/diagnostico.md](docs/diagnostico.md) | 1 | 7 touchpoints, 2 momentos de verdad, 3 fallos priorizados, curva inicial |
| [evidencias/curva-antes.svg](evidencias/curva-antes.svg) | 1 | Curva emocional inicial (estimada) |
| [evidencias/issues.md](evidencias/issues.md) | 1–5 | Texto de los Issues #1–#4 |
| [docs/requisitos.md](docs/requisitos.md) | 2 | RF-01 a RF-06 y RNF verificables |
| [diagramas/sitemap.md](diagramas/sitemap.md) | 2 | Sitemap |
| [diagramas/user-flow.md](diagramas/user-flow.md) | 2 | User flow: rama principal, error/editar y error de guardado |
| [wireframes/](wireframes/) | 2 | W1 Inicio · W2 Acción (Sesión) · W3 Error · W4 Confirmación |
| [docs/trazabilidad.md](docs/trazabilidad.md) | 2 | Requisito → flujo → pantalla → componente → wireframe → código |
| [prototipo/v1/](prototipo/v1/) | 3 | Prototipo navegable v1 |
| [docs/decisiones.md](docs/decisiones.md) | 3 | Fidelidad, herramienta, estados y guía de ejecución |
| [pruebas/sesion.md](pruebas/sesion.md) | 4 | Protocolo y registro de la prueba cognitiva |
| [prototipo/v2/](prototipo/v2/) | 4–5 | Corrección del hallazgo + incidencia sorpresa + simuladores de las 12 tarjetas (`IHC-A-01` a `IHC-A-12`) |
| [evidencias/capturas/](evidencias/capturas/) | 4–5 | Capturas antes/después |
| [docs/defensa.md](docs/defensa.md) | 5 | Incidencia, respuesta, guion de demostración y contribuciones |
| [docs/tarjetas-12-incidencias.md](docs/tarjetas-12-incidencias.md) | 1–5 | Catálogo completo de las 12 tarjetas privadas (`IHC-A-01` a `IHC-A-12`), sus 12 incidencias sorpresa y respuestas individuales |

## Resumen v1 → v2

| Aspecto | v1 | v2 |
|---|---|---|
| Obligatorios | Asterisco `*` | Región propia "Obligatorios · n de 4" + etiqueta "Obligatorio" |
| Error al cerrar | "Hay ítems obligatorios pendientes" (genérico) | Lista de cada pendiente con enlace que mueve el foco |
| Cierre | Directo a "Sesión cerrada" | Revisión previa editable → guardado → relectura → código de verificación |
| Fallo de guardado | No contemplado | Error, la sesión sigue abierta y los datos se conservan |
| 12 Tarjetas e Incidencias | Caso base individual | Catálogo y simuladores funcionales en vivo para las 12 tarjetas (`IHC-A-01` a `IHC-A-12`) |
