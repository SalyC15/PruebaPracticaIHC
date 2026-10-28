# Decisiones de diseño y guía de ejecución

## Fidelidad y herramienta

| Decisión | Justificación |
|---|---|
| **Fidelidad media, funcional** (HTML + CSS + JavaScript, sin librerías) | La tarjeta exige comprobar *comportamiento*: conservar pasos tras recargar y bloquear el éxito falso. Un prototipo en Figma no puede demostrar persistencia real ni validación. El estilo visual es sobrio a propósito: lo evaluado es la interacción. |
| **`localStorage` como "servidor"** | Simula el guardado automático sin backend; permite demostrar en vivo la restricción "no perder los pasos finalizados" con F5. |
| **Componentes de la referencia Dashboard** | Card UI (región común), Stepper (visibilidad del estado) y checklist en Grid (proximidad), adaptados a la tarea de retomar y cerrar. |

## Decisiones de interacción

| Tema | Decisión | Requisito |
|---|---|---|
| Estados | Normal, **procesando** ("Cerrando…", botón deshabilitado y `aria-busy`), **error** (`role="alert"`, foco en el mensaje) y **éxito** (solo tras validar obligatorios y pasos). | RF-04, RF-06, RNF-03 |
| Feedback | Indicador "● Guardado HH:MM" en la barra, región `aria-live` para anuncios y aviso "Recuperamos…" al retomar. | RF-01, RF-02 |
| Edición / cancelación | "Reabrir paso", casillas reversibles y botón "Volver al Dashboard". | RF-05 |
| Teclado y foco | Todo con controles nativos; al cambiar de pantalla el foco va al `h1`; **Escape** vuelve un nivel (ignorado dentro de campos de entrada). | RNF-01 |
| Color | El estado del paso se expresa con texto ("Actual", "Completado", "Pendiente"). | RNF-02 |
| 360 px | El Stepper pasa a 2 o 3 columnas y el registro y el checklist se apilan. | RNF-04 |

## Guía de ejecución

1. Abrir una terminal en la raíz del repositorio y ejecutar:
   ```bash
   python -m http.server 8012
   ```
2. Abrir el navegador en:
   - v1: http://localhost:8012/prototipo/v1/
3. **Ruta normal:** Retomar → completar los pasos 4–6 → marcar *Grabación* y *SUS* → "Cerrar sesión".
4. **Ruta de error:** Retomar → "Cerrar sesión" sin completar → alerta de bloqueo con foco.
5. **Persistencia:** marcar algo y pulsar F5 → se conserva.
6. "Restablecer datos de demostración" (pie de página) vuelve al estado inicial.
