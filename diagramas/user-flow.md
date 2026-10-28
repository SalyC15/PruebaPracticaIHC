# User flow — Recuperar checklist y cerrar sesión

Leyenda (igual que en el repositorio CaféU): rectángulo = pantalla, rombo = decisión, borde rojo = error, borde verde = éxito.

```mermaid
flowchart TD
    S([Inicio: la investigadora abre el Dashboard]) --> P1["Pantalla Inicio<br/>Card 'P-07 · Interrumpida · paso 4/6'"]
    P1 -->|Retomar| P2["Pantalla Sesión<br/>Aviso: 'Recuperamos 3 pasos…'"]
    P2 --> D1{"¿Los pasos 1–3<br/>siguen completados?"}
    D1 -- No --> E0["Error: no se pudo recuperar<br/>→ Reintentar / datos locales"]:::err
    E0 --> P2
    D1 -- Sí --> A1["Registrar etapa 4–6:<br/>errores, tiempo, observaciones"]
    A1 --> A2["Marcar checklist"]
    A2 --> A3["Cerrar sesión"]
    A3 --> D2{"¿Todos los obligatorios<br/>verificados?"}
    D2 -- No --> E1["Error RF-05: lista de pendientes<br/>con enlaces (foco al ítem)"]:::err
    E1 -->|Rama editar| A2
    D2 -- Sí --> P3["Pantalla Revisión previa (RF-06)"]
    P3 --> D3{"¿Todo correcto?"}
    D3 -- "No · Editar sección" --> A1
    D3 -- Sí --> A4["Confirmar cierre<br/>(estado Procesando)"]
    A4 --> D4{"¿Guardado verificado?<br/>(relectura + código)"}
    D4 -- No --> E2["Error: no se confirmó el guardado<br/>Datos conservados · Reintentar"]:::err
    E2 --> P3
    D4 -- Sí --> P4["Pantalla Confirmación<br/>'Cerrada · verificada' + resumen"]:::ok
    P4 --> F([Fin])

    classDef err stroke:#b42318,stroke-width:2px,stroke-dasharray:4 3;
    classDef ok stroke:#067647,stroke-width:2px;
```

## Ramas

| Rama | Recorrido | Requisitos |
|---|---|---|
| **Principal** | Inicio → Retomar → Sesión → registrar → checklist completo → Revisión → Confirmar → Confirmación | RF-01, RF-02, RF-04, RF-06 |
| **Error / editar (checklist)** | Cerrar con pendientes → error con lista → ir al ítem → marcar → Cerrar | RF-03, RF-05 |
| **Editar desde revisión** | Revisión → "Editar" sección → Sesión → Revisión | RF-06 (principio de confirmar/editar tomado de CaféU) |
| **Error de guardado** | Confirmar → verificación falla → error, datos conservados → Reintentar | RF-01, RF-06 |

> **Principio del repositorio complementario (CaféU):** el flujo de "Mi pedido" separa *editar* de *confirmar* y termina en una **confirmación visible** con identificador (`#CU-104`). Aquí la Revisión previa cumple el papel de "Mi pedido" y la Confirmación muestra el código de verificación de la sesión.

## Versión v1 (antes de la incidencia)

En v1 no existen los nodos *Revisión previa* ni *¿Guardado verificado?*: tras D2 = Sí se pasa directo a Confirmación. Fueron añadidos por la incidencia sorpresa (Issue #4).
