# Catálogo Oficial de las 12 Tarjetas e Incidencias Sorpresa (`IHC-A-01` a `IHC-A-12`)

**Universidad Técnica de Ambato · FISEI · Carrera de Software · IHC · Paralelo A**

> **Protocolo oficial:** Asignar incidente a tarjeta correspondiente, solicitar nuevo Issue, modificación visible en el prototipo, commit posterior al anuncio (`31e89bf`), prueba funcional y defensa personal.
> Todas las 12 tarjetas y sus simuladores interactivos están integrados directamente en el prototipo navegable (`prototipo/v2/`).

---

## Resumen General de las 12 Tarjetas

| Tarjeta | Caso Base | Título de la Incidencia | Evento Imprevisto (Minuto 100) | Cambio Obligatorio | Commit SHA |
|---|---|---|---|---|---|
| **IHC-A-01** | CaféU | Precio cambia al editar | Tras modificar de 1 a 2 cafés, la pantalla conserva USD 4,25 aunque el total real cambia. | Actualizar subtotales y total, identificar diferencia y pedir nueva revisión antes de confirmar. | `31e89bf` |
| **IHC-A-02** | CaféU | Quitar con teclado | La persona pulsa Quitar con teclado y el foco desaparece; no sabe qué se eliminó. | Anunciar producto eliminado, devolver foco a control pertinente y permitir Deshacer simulado. | `31e89bf` |
| **IHC-A-03** | CaféU | Estado de pedido pendiente | La aplicación tarda ocho segundos tras confirmar; el usuario vuelve a pulsar el botón. | Deshabilitar repetición, mostrar pendiente y resolverlo a confirmado o no confirmado sin duplicar. | `31e89bf` |
| **IHC-A-04** | CaféU | Alergia añadida | El producto seleccionado ahora contiene un alérgeno no visible en el detalle. | Mostrar ingrediente/alerta antes de confirmar y ofrecer volver al detalle sin vaciar carrito. | `31e89bf` |
| **IHC-A-05** | CaféU | Presupuesto agotado | El precio del producto se incrementa USD 0,50 antes de confirmar. | Actualizar total, explicar el cambio y permitir modificar cantidades o cancelar. | `31e89bf` |
| **IHC-A-06** | CaféU | Falla de conexión | La red se interrumpe en el instante de confirmar y el sistema desconoce el resultado. | Mostrar no confirmado, reintento seguro y conservar datos; evitar afirmar éxito no verificado. | `31e89bf` |
| **IHC-A-07** | Dashboard UX | Paso de checklist obligatorio | El docente añade una verificación obligatoria antes de entrar a Ejecución. | Actualizar Stepper, regla de avance, retroalimentación contextual y navegación de retorno. | `31e89bf` |
| **IHC-A-08** | Dashboard UX | Guardado inconsistente | El usuario marca tres casillas, cambia de etapa y vuelve: aparecen desmarcadas. | Conservar valores, informar su estado de guardado y diferenciar pendiente/completo. | `31e89bf` |
| **IHC-A-09** | Dashboard UX | Dato personal inesperado | La interfaz ahora solicita el nombre completo de un participante y lo incluye en resumen. | Sustituir por código anónimo y eliminar nombre del resumen sin perder métricas. | `31e89bf` |
| **IHC-A-10** | Dashboard UX | Stepper sin color | El docente activa una visualización en escala de grises y elimina el color del estado activo. | Identificar estado por texto y atributos semánticos; demostrar operación por teclado. | `31e89bf` |
| **IHC-A-11** | Dashboard UX | Vista estrecha | Se reduce la ventana a 320 px y el botón Siguiente queda fuera de pantalla. | Ajustar maquetación, evitar desplazamiento horizontal y conservar orden de lectura. | `31e89bf` |
| **IHC-A-12** *(Principal)* | Dashboard UX | Finalización prematura | El sistema marca finalizada una sesión aunque falta un requisito del checklist. | Impedir finalización falsa, explicar elemento pendiente y permitir completarlo sin borrar datos. | `31e89bf` |

---

## Bloque 1: Caso Base CaféU (`IHC-A-01` a `IHC-A-06`)

### Tarjeta `IHC-A-01` · Precio cambia al editar
- **Evento imprevisto:** Tras modificar de 1 a 2 cafés, la pantalla conserva `USD 4,25` aunque el total real cambia.
- **Cambio obligatorio:** Implementar actualización de subtotales y total, identificar diferencia (`+USD 2,50` / nuevo total `USD 6,75`), y pedir nueva revisión antes de confirmar.
- **Evidencias:** Nuevo requisito `R7` (recálculo reactivo y re-verificación de total), `user-flow.md` corregido, captura del total y test interactivo de edición en `prototipo/v2/`.
- **Pregunta de defensa:** *¿Qué parte de la rama de editar del user flow se modifica?*
  - **Respuesta:** En la rama de edición (`Editar cantidades`), tras cualquier cambio de cantidad se invalida el estado de *"Revisión aprobada"* y se inserta un nodo de decisión obligatorio **`¿Total recalculado y revisado por el usuario?`**. El flujo no permite pasar directamente al nodo `Confirmar pedido`; obliga a pasar por la vista de `Revisión de desglose` mostrando el precio anterior (`USD 4,25`), la diferencia (`+USD 2,50`) y el nuevo total (`USD 6,75`).

---

### Tarjeta `IHC-A-02` · Quitar con teclado
- **Evento imprevisto:** La persona pulsa *Quitar* con teclado y el foco desaparece; no sabe qué se eliminó.
- **Cambio obligatorio:** Anunciar producto eliminado (`aria-live="polite"`), devolver foco a un control pertinente (el botón *Deshacer* o el siguiente ítem de la lista) y permitir *Deshacer* simulado.
- **Evidencias:** Secuencia `Tab`/`Enter`, prueba sin ratón, commit y wireframe ajustado.
- **Pregunta de defensa:** *Demuestre edición, eliminación y confirmación sin usar el ratón.*
  - **Respuesta:** Con `Tab` se navega al campo de cantidad (flechas arriba/abajo para editar), con `Tab` se pasa al botón `Quitar <producto>` y se pulsa `Enter`. Al eliminarse, el contenedor `#anuncio` (`aria-live="polite"`) narra *"Producto eliminado. Pulsa Enter en Deshacer para restaurarlo"* y el foco se mueve automáticamente al botón `Deshacer eliminación`. Con un `Tab` más se llega a `Confirmar` y se ejecuta con `Enter`.

---

### Tarjeta `IHC-A-03` · Estado de pedido pendiente
- **Evento imprevisto:** La aplicación tarda ocho segundos tras confirmar; el usuario vuelve a pulsar el botón.
- **Cambio obligatorio:** Deshabilitar repetición (`disabled` + `aria-busy="true"`), mostrar estado pendiente con progreso/cuenta regresiva de 8 s y resolverlo a *Confirmado* o *No confirmado* sin duplicar el pedido (clave de idempotencia).
- **Evidencias:** Tres estados (*Normal*, *Pendiente 8 s*, *Confirmado/No confirmado*), prueba de doble clic, registro de Issue y commit.
- **Pregunta de defensa:** *¿Cómo evita confundir clic efectuado con pedido confirmado?*
  - **Respuesta:** Separando visual y semánticamente el estado transitorio (**"Procesando pedido… (8 s) — No cierres ni vuelvas a pulsar"**, botón deshabilitado con spinner y `aria-busy="true"`) del estado final verificado (**"✓ Pedido confirmado · Código #CU-4821"**). Mientras está pendiente no se muestra el icono de éxito ni el código de retiro.

---

### Tarjeta `IHC-A-04` · Alergia añadida
- **Evento imprevisto:** El producto seleccionado ahora contiene un alérgeno no visible en el detalle.
- **Cambio obligatorio:** Mostrar ingrediente/alerta destacada antes de confirmar (`role="alert"`) y ofrecer volver al detalle para cambiar la opción (ej. leche deslactosada/almendra) **sin vaciar el carrito**.
- **Evidencias:** Captura, rama de editar en flujo, prueba de comprensión.
- **Pregunta de defensa:** *¿Cómo prueba que el usuario comprende y puede corregir su elección?*
  - **Respuesta:** En la prueba de comprensión de 5 segundos, el usuario identifica el banner de advertencia de alérgeno (`Contiene lácteos / trazas de frutos secos`) antes del botón de pago. El botón `Corregir ingrediente (conservar carrito)` abre el detalle del ítem manteniendo los demás productos intactos, y al elegir la alternativa segura el aviso cambia a `✓ Alérgeno sustituido`.

---

### Tarjeta `IHC-A-05` · Presupuesto agotado
- **Evento imprevisto:** El precio del producto se incrementa `USD 0,50` antes de confirmar.
- **Cambio obligatorio:** Actualizar el total en vivo, explicar claramente el incremento (`+USD 0,50` por ajuste de insumo/tamaño) y permitir modificar cantidades o cancelar sin penalización.
- **Evidencias:** Requisito `R7`, pantalla de desglose comparativo, prueba y commit.
- **Pregunta de defensa:** *¿Qué touchpoint pasa a ser momento de verdad y por qué?*
  - **Respuesta:** El touchpoint de **Revisión del desglose previo al pago** pasa a ser un **Momento de Verdad crítico**, porque un cambio de precio de último segundo afecta directamente la confianza del usuario y su restricción de presupuesto; si no se explica con transparencia ni se permite ajustar la cantidad o cancelar al instante, se produce abandono y frustración severa.

---

### Tarjeta `IHC-A-06` · Falla de conexión
- **Evento imprevisto:** La red se interrumpe en el instante de confirmar y el sistema desconoce el resultado.
- **Cambio obligatorio:** Mostrar estado **No confirmado**, botón de **Reintento seguro** (idempotente) y conservar los datos del pedido en almacenamiento local; nunca afirmar éxito no verificado.
- **Evidencias:** Estados simulados, prueba de reintento, rama de error.
- **Pregunta de defensa:** *¿Cómo diferencia visualmente y semánticamente los tres estados?*
  - **Respuesta:**
    1. **Enviando/Verificando:** borde azul informativo, spinner animado, `aria-busy="true"`, texto *"Verificando con el servidor…"*.
    2. **No confirmado (Error de red):** contenedor rojo/ámbar con `role="alert"`, icono `⚠`, texto *"Conexión interrumpida: pedido NO confirmado (datos guardados)"* y botón `Reintentar envío seguro`.
    3. **Confirmado y verificado:** contenedor verde con icono `✓`, `role="status"`, timestamp y código único de verificación.

---

## Bloque 2: Caso Base Dashboard UX (`IHC-A-07` a `IHC-A-12`)

### Tarjeta `IHC-A-07` · Paso de checklist obligatorio
- **Evento imprevisto:** El docente añade una verificación obligatoria antes de entrar a Ejecución.
- **Cambio obligatorio:** Actualizar el Stepper, imponer la regla de avance secuencial (no avanzar a Ejecución/Tarea sin completar los pasos previos y la verificación pre-ejecución), dar retroalimentación contextual y navegación de retorno al paso pendiente.
- **Evidencias:** Nuevo requisito y trazabilidad, test funcional en `prototipo/v2/`, commit.
- **Pregunta de defensa:** *¿Cómo aplica la visibilidad del estado del sistema de Nielsen?*
  - **Respuesta:** Cada botón del Stepper muestra explícitamente el número de paso, nombre y etiqueta textual de estado (`Completado`, `Actual`, `Pendiente`) además de `aria-current="step"`. Si se intenta completar un paso posterior sin haber completado el anterior, el sistema bloquea el avance y muestra un banner con enlace directo al paso previo requerido.

---

### Tarjeta `IHC-A-08` · Guardado inconsistente
- **Evento imprevisto:** El usuario marca tres casillas, cambia de etapa y vuelve: aparecen desmarcadas.
- **Cambio obligatorio:** Conservar todos los valores en `localStorage` en cada evento `change`/`input`, informar la hora exacta en el indicador `● Guardado HH:MM` (`aria-live="polite"`) y diferenciar visual y textualmente `Pendiente` vs `Completado`.
- **Evidencias:** Capturas antes/después, prueba de retorno entre pasos y pantallas, revisión de PR.
- **Pregunta de defensa:** *¿Qué evidencia muestra una mejora real frente a una mejora inferida?*
  - **Respuesta:** Una mejora **inferida** es suponer que el usuario sabe que se guardó; una mejora **real y observada** se demuestra en la prueba (`pruebas/sesion.md`) cuando el participante marca 3 casillas, navega a otro paso o recarga el navegador (`F5`), y al volver comprueba que las 3 casillas siguen marcadas (`Obligatorios · 3 de 4`) junto al sello `● Guardado HH:MM`, reduciendo las dudas observadas de 2 a 0.

---

### Tarjeta `IHC-A-09` · Dato personal inesperado
- **Evento imprevisto:** La interfaz ahora solicita el nombre completo de un participante y lo incluye en el resumen.
- **Cambio obligatorio:** Sustituir cualquier nombre personal por un **código anónimo (`P-07`)**, bloquear/sanitizar nombres propios en las observaciones o campos de participante y eliminar datos personales del resumen final sin perder las métricas (`errores`, `tiempo`, `SUS`).
- **Evidencias:** Validación de anonimización, requisito de privacidad (`RNF-04`), prueba y commit.
- **Pregunta de defensa:** *¿Qué requisito protege privacidad y dónde aparece en la trazabilidad?*
  - **Respuesta:** La privacidad está protegida por el requisito de anonimización de participantes (identificador `P-07` en lugar de nombre completo y sanitización en vista de resumen), trazado en `docs/trazabilidad.md` hacia la cabecera `#t-sesion`, el objeto `s.id = 'P-07'` y la función `renderCerrada()` en `prototipo/v2/app.js`.

---

### Tarjeta `IHC-A-10` · Stepper sin color
- **Evento imprevisto:** El docente activa una visualización en escala de grises y elimina el color del estado activo.
- **Cambio obligatorio:** Identificar el estado de cada paso por **texto explícito** (`✓` + `"Completado"`, `"Actual"`, `"Pendiente"`), borde diferenciado y atributo semántico `aria-current="step"`, demostrando operación íntegra por teclado + modo escala de grises activable en el prototipo.
- **Evidencias:** Modo escala de grises en `prototipo/v2/`, foco visible (`3px solid`), narración del estado y commit.
- **Pregunta de defensa:** *Demuestre cómo conoce el paso actual sin depender del color.*
  - **Respuesta:** Al activar el botón **"Escala de grises (IHC-A-10)"** en el prototipo (`filter: grayscale(100%)`), el paso activo sigue siendo inequívoco por tres mecanismos no cromáticos: 1) la etiqueta textual explícita **`Actual`** debajo del nombre del paso ( frente a `✓` / `Completado` y `Pendiente`), 2) el grosor de borde (`2px solid` + barra inferior de `4px`), y 3) el atributo `aria-current="step"` anunciado por el lector de pantalla al navegar con `Tab`.

---

### Tarjeta `IHC-A-11` · Vista estrecha
- **Evento imprevisto:** Se reduce la ventana a `320 px` y el botón *Siguiente / Completar* queda fuera de pantalla.
- **Cambio obligatorio:** Ajustar maquetación responsiva (`@media (max-width: 400px)` y soporte hasta `320 px`), evitar cualquier desplazamiento horizontal (`overflow-x`) y conservar el orden lógico de lectura y tabulación.
- **Evidencias:** Capturas en vista estrecha (`320 px` / `360 px`), checklist de accesibilidad, commit.
- **Pregunta de defensa:** *¿Qué ley Gestalt aplica y qué carga cognitiva se reduce?*
  - **Respuesta:** Se aplican las leyes de **Proximidad** y **Región Común** (agrupando los campos de registro y sus botones de acción dentro de la misma tarjeta adaptada a 1 columna en `320 px`, y los ítems obligatorios en su propio `<fieldset>`). Esto reduce la **carga cognitiva extrínseca** (evitar desplazarse horizontalmente buscando controles ocultos) y la **carga en memoria de trabajo** al mantener visible el contexto del paso actual junto a su acción primaria.

---

### Tarjeta `IHC-A-12` · Finalización prematura *(Tarjeta Principal del Repositorio)*
- **Evento imprevisto:** El sistema marca finalizada una sesión aunque falta un requisito del checklist.
- **Cambio obligatorio:** Impedir finalización falsa (`intentarCerrar()`), explicar cada elemento pendiente con enlaces que mueven el foco (`mostrarErrores()`), permitir completarlo sin borrar datos, exigir **Revisión previa editable** y verificar el guardado con huella FNV-1a (`huella()` y `estaVerificada()`).
- **Evidencias:** Flujo actualizado (`diagramas/user-flow.md`), tres estados, test funcional (`?fallo=1` y detección de alteración en `localStorage`) y commit (`31e89bf`).
- **Pregunta de defensa:** *¿Cómo muestra el momento de verdad y comprueba el estado final?*
  - **Respuesta:**
    1. **Momento de verdad (`MdV 2`, cerrar sesión):** El sistema nunca salta directo a *"Completado"*. Primero valida los 6 pasos y los 4 ítems obligatorios; si falta alguno, bloquea el cierre, conserva los datos y muestra la lista interactiva de pendientes con traslado de foco. Cuando todo está completo, abre la **Revisión previa editable**.
    2. **Comprobación del estado final (`estaVerificada()` + `huella()`):** Al confirmar, guarda en `localStorage`, **relee** el almacenamiento y compara el hash FNV-1a (`huella()`) con `s.cierre.codigo`. Además, tanto en Inicio (`renderInicio()`) como en Confirmación (`renderCerrada()`), vuelve a ejecutar `estaVerificada()`. Si alguien modifica `localStorage` después de cerrar, el sistema detecta la discrepancia y muestra `✕ Cerrada · NO verificada`.
