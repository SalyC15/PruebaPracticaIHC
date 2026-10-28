# User flow — Flujos actualizados por Incidencias (Dashboard UX `IHC-A-12` y CaféU `IHC-A-01`)

Leyenda: rectángulo = pantalla, rombo = decisión, borde rojo = error/revisión pendiente, borde verde = éxito verificado.

## 1. Caso Dashboard UX · Tarjeta `IHC-A-12` (Finalización prematura · Issue #4)

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
    A4 --> D4{"¿Guardado verificado?<br/>(relectura + huella FNV-1a)"}
    D4 -- No --> E2["Error: no se confirmó el guardado<br/>Datos conservados · Reintentar"]:::err
    E2 --> P3
    D4 -- Sí --> P4["Pantalla Confirmación<br/>'Cerrada · verificada' + resumen"]:::ok
    P4 --> F([Fin])

    classDef err stroke:#b42318,stroke-width:2px,stroke-dasharray:4 3;
    classDef ok stroke:#067647,stroke-width:2px;
```

---

## 2. Caso CaféU · Tarjeta `IHC-A-01` (Precio cambia al editar · Issue #9 · Requisito `RF-07 / R7`)

> **Modificación en la rama de editar (`IHC-A-01`):** Cuando el usuario modifica la cantidad de cafés (de 1 a 2), el flujo invalida la confirmación directa, recalcula subtotales (`USD 2,50` → `USD 5,00`) y el total real (`USD 4,25` → `USD 6,75`), muestra la diferencia (`+USD 2,50`) y exige pasar por el nodo de decisión **`¿Nuevo total revisado y aceptado?`** antes de habilitar `Confirmar pedido`.

```mermaid
flowchart TD
    C0([Inicio pedido CaféU: 1 Café USD 2,50 + Croissant USD 1,75 = USD 4,25]) --> C1["Pantalla Mi Pedido<br/>Total inicial: USD 4,25"]
    C1 -->|Rama editar cantidad: de 1 a 2 cafés| C2["Recálculo reactivo (RF-07 / R7)<br/>Subtotal Café: USD 5,00 · Diferencia: +USD 2,50<br/>Nuevo Total Real: USD 6,75"]
    C2 --> D_Rev{"¿Nuevo total revisado<br/>y aceptado por el usuario?"}
    D_Rev -- "No (Confirmar bloqueado)" --> E_Rev["Aviso de cambio de precio:<br/>Exige pulsar 'Revisar y aceptar nuevo total'"]:::err
    E_Rev -->|Usuario pulsa Revisar y aceptar| D_Rev
    D_Rev -- Sí --> C4["Habilitar 'Confirmar pedido'<br/>y procesar orden verificada (USD 6,75)"]:::ok
    C4 --> CF([Fin: Pedido confirmado con total real])

    classDef err stroke:#b42318,stroke-width:2px,stroke-dasharray:4 3;
    classDef ok stroke:#067647,stroke-width:2px;
```

## Tabla de Ramas Integrada

| Caso Base | Rama | Recorrido | Requisitos | Issue |
|---|---|---|---|---|
| **Dashboard UX (`IHC-A-12`)** | Principal | Inicio → Retomar → Sesión → registrar → checklist completo → Revisión → Confirmar → Confirmación | RF-01, RF-02, RF-04, RF-06 | #1, #2, #4 |
| **Dashboard UX (`IHC-A-12`)** | Error / editar (checklist) | Cerrar con pendientes → error con lista → ir al ítem → marcar → Cerrar | RF-03, RF-05 | #1, #3 |
| **Dashboard UX (`IHC-A-12`)** | Error de guardado | Confirmar → verificación falla (`?fallo=1`) → error, datos conservados → Reintentar | RF-01, RF-06 | #4 |
| **CaféU (`IHC-A-01`)** | **Rama editar cantidad y precio** | Mi Pedido (`USD 4,25`) → Editar de 1 a 2 cafés → Recalcular subtotal/total (`USD 6,75`) y diferencia (`+USD 2,50`) → Bloquear confirmación hasta nueva revisión → Aceptar nuevo total → Confirmar | **RF-07 (`R7`)** | **#9** |
