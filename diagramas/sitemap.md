# Sitemap — Dashboard UX (IHC-A-12)

```mermaid
flowchart TD
    A["Dashboard · Inicio<br/>(lista de sesiones)"] --> B["Sesión P-07<br/>(registro de prueba)"]
    A --> H["Ayuda / guion del moderador"]
    B --> B1["Stepper · 6 pasos"]
    B --> B2["Registro de la etapa<br/>(errores, tiempo, observaciones)"]
    B --> B3["Checklist de cierre"]
    B --> D["Confirmación · Sesión cerrada<br/>(resumen de cierre)"]
    D --> A
```

| Nivel | Pantalla | Componentes principales |
|---|---|---|
| 0 | Inicio | Card UI por sesión, badge de estado, botón "Retomar" |
| 1 | Sesión | Stepper, formulario de registro, Checklist Grid, indicador de guardado, "Cerrar sesión" |
| 2 | Confirmación | Estado "Sesión cerrada", resumen de pasos y checklist |

Navegación global: barra superior con migas de pan *Sesiones › P-07 › Cerrada*.
