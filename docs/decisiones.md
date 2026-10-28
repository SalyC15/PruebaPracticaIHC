# Decisiones de diseño y guía de ejecución

## Fidelidad y herramienta

| Decisión | Justificación |
|---|---|
| **Fidelidad media, funcional** (HTML + CSS + JavaScript, sin librerías) | La tarjeta exige comprobar *comportamiento*: conservar pasos tras recargar, bloquear el éxito falso y verificar el guardado. Un prototipo en Figma no puede demostrar persistencia real ni validación. El estilo visual es sobrio a propósito: lo evaluado es la interacción. |
| **`localStorage` como "servidor"** | Simula el guardado automático sin backend; permite demostrar en vivo la restricción "no perder los pasos finalizados" con F5. |
| **Componentes de la referencia Dashboard** | Card UI (región común), Stepper (visibilidad del estado) y checklist en Grid (proximidad), adaptados a la tarea de retomar y cerrar. |
| **Principio de CaféU** | Separación *editar / confirmar* antes de una acción irreversible y **confirmación visible con identificador** (`#CU-104` → código de verificación `XX-XXXX`). |

## Decisiones de interacción

| Tema | Decisión | Requisito |
|---|---|---|
| Estados | Normal, **procesando** ("Cerrando y verificando…", botón deshabilitado y `aria-busy`), **error** (`role="alert"`, foco en el mensaje) y **éxito** (solo tras releer y comparar). | RF-04, RF-06, RNF-03 |
| Feedback | Indicador "● Guardado HH:MM" en la barra, región `aria-live` para anuncios y aviso "Recuperamos…" al retomar. | RF-01, RF-02 |
| Edición / cancelación | "Reabrir paso", casillas reversibles, "Editar" por sección en la Revisión y "Volver a la sesión". | RF-05, RF-06 |
| Teclado y foco | Todo con controles nativos; al cambiar de pantalla el foco va al `h1`; los enlaces del error mueven el foco al control pendiente; **Escape** vuelve un nivel. | RNF-01 |
| Color | El estado del paso y la obligatoriedad se expresan con texto ("Actual", "Completado", "Obligatorio", "— pendiente"). | RNF-02, RF-03 |
| 360 px | El Stepper pasa a 2 o 3 columnas y el registro y el checklist se apilan. | RNF-04 |

## Guía de ejecución

1. Abrir una terminal en la raíz del repositorio y ejecutar:
   ```bash
   python -m http.server 8012
   ```
2. Abrir el navegador en:
   - v1: http://localhost:8012/prototipo/v1/
   - v2: http://localhost:8012/prototipo/v2/
   (No se recomienda abrir el `index.html` con doble clic: algunos navegadores bloquean el almacenamiento con `file://`.)
3. **Ruta normal:** Retomar → completar los pasos 4–6 → marcar *Grabación* y *SUS* → "Revisar y cerrar sesión" → "Confirmar cierre" → "Comprobar de nuevo".
4. **Ruta de error:** Retomar → "Revisar y cerrar sesión" sin completar → se listan los pendientes → pulsar un enlace (el foco va a la casilla).
5. **Fallo de guardado:** abrir `prototipo/v2/?fallo=1` y confirmar el cierre → error, la sesión sigue abierta.
6. **Persistencia:** marcar algo y pulsar F5 → se conserva.
7. "Restablecer datos de demostración" (pie de página) vuelve al estado inicial.
