# 📜 Directivas del Sistema - Calculadora de Yogures

Este documento sirve como guía maestra para el desarrollo, mantenimiento y mejora de la Calculadora de Yogures Caseros.

## 🏗️ Arquitectura y Principios de Diseño

El sistema sigue una arquitectura modular basada en la **Separación de Preocupaciones (SoP)**:

1.  **Lógica (`js/logic/calculadora.js`)**: Funciones puras para cálculos matemáticos. No deben interactuar con el DOM.
2.  **Servicios (`js/services/bcv.js`)**: Comunicación con APIs externas. Actualmente usa `corsproxy.io` para obtener la tasa del BCV.
3.  **Interfaz de Usuario (`js/ui/handlers.js`)**: Gestión masiva de eventos, manipulación del DOM y renderizado.
4.  **Entrada (`js/app.js`)**: Punto de arranque que coordina la carga inicial.
5.  **Estilos (`css/styles.css`)**: Sistema de diseño basado en variables CSS, con enfoque en legibilidad y suavidad visual.

### Reglas de Oro
- **Idioma**: Todo el código, comentarios y documentación DEBEN estar en español.
- **Simplicidad**: El diseño debe ser intuitivo para personas mayores. Usamos burbujas de ayuda con lenguaje cercano ("Hola Mamá").
- **Realidad Venezolana**: Siempre priorizar el formato local de moneda (`de-DE` para punto en miles y coma en decimales) y la tasa del BCV.
- **Portabilidad**: El proyecto debe funcionar sin base de datos, usando `localStorage` con prefijos (`yogures_`).
- **SoP Estricto**: La lógica de cálculo no debe conocer el DOM. La UI no debe realizar cálculos complejos por sí misma.

## 🎨 Guía de Estilos (Look & Feel)
- **Paleta de Colores**: Inspirada en yogures (Fresa, Mora, Melocotón).
- **Tipografía**: Fuentes legibles y modernas (ej. Inter o Roboto).
- **Interactividad**: Uso de micro-animaciones y efectos de hover suaves.

## 🚀 Próximas Mejoras (Post-Viralidad)
- [ ] Implementar sistema de "Compartir Receta" vía imagen o texto.
- [ ] Refinar las burbujas de ayuda para que sean más interactivas.
- [ ] Optimizar el rendimiento del scraping del BCV.
