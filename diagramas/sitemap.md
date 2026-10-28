# Sitemap — Dashboard UX (IHC-A-12)

```mermaid
flowchart TD
    A["Dashboard · Inicio<br/>(lista de sesiones)"] --> B["Sesión P-07<br/>(registro de prueba)"]
    A --> H["Ayuda / guion del moderador"]
    B --> B1["Stepper · 6 pasos"]
    B --> B2["Registro de la etapa<br/>(errores, tiempo, observaciones)"]
    B --> B3["Checklist Grid<br/>(obligatorios / opcionales)"]
    B --> C["Revisión previa al cierre"]
    C -->|Editar sección| B
    C --> D["Confirmación · Sesión cerrada<br/>(resumen comprobable)"]
    D --> A
```

| Nivel | Pantalla | Componentes principales |
|---|---|---|
| 0 | Inicio | Card UI por sesión, badge de estado, botón "Retomar" |
| 1 | Sesión | Stepper, formulario de registro, Checklist Grid, indicador de guardado, "Cerrar sesión" |
| 2 | Revisión previa | Resumen por secciones con "Editar", "Confirmar cierre", "Volver" |
| 3 | Confirmación | Estado "Cerrada · verificada", código de verificación, "Comprobar de nuevo" |

Navegación global: barra superior con migas de pan *Dashboard › Sesión P-07 › Revisión*.
