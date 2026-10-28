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
    A3 --> D2{"¿Todos los obligatorios<br/>y pasos verificados?"}
    D2 -- No --> E1["Error RF-05: bloqueo de cierre<br/>(datos conservados)"]:::err
    E1 -->|Rama editar| A2
    D2 -- Sí --> P4["Pantalla Confirmación<br/>'Sesión cerrada' + resumen"]:::ok
    P4 --> F([Fin])

    classDef err stroke:#b42318,stroke-width:2px,stroke-dasharray:4 3;
    classDef ok stroke:#067647,stroke-width:2px;
```

## Ramas

| Rama | Recorrido | Requisitos |
|---|---|---|
| **Principal** | Inicio → Retomar → Sesión → registrar → checklist completo → Cerrar → Confirmación | RF-01, RF-02, RF-04, RF-06 |
| **Error / editar (checklist)** | Cerrar con pendientes → bloqueo con mensaje de error → editar checklist/pasos → Cerrar | RF-03, RF-05 |
