# 🍦 Calculadora de Yogures Caseros

Una herramienta estética, sencilla y potente diseñada para pequeños emprendimientos de yogures artesanales. Optimizada para ser utilizada por personas mayores y adaptada 100% a la realidad económica de Venezuela.

![Interfaz de la calculadora](https://raw.githubusercontent.com/antigravity-ai/assets/main/yogurt-calc-preview.png) *(Nota: Reemplazar con captura real al subir)*

## ✨ Características Principales

- **🎨 Diseño Premium**: Interfaz "cremosa" y suave con colores inspirados en el yogurt (fresa, mora, melocotón).
- **📱 Mobile First**: Diseñada para funcionar perfectamente en teléfonos móviles sin desbordamientos.
- **🇻🇪 Adaptada a Venezuela**: 
  - Formato numérico local (punto para miles, coma para decimales).
  - Consulta automática del precio del dólar oficial del **BCV**.
  - Opción de ajuste manual de la tasa con memoria persistente.
- **👩‍🍳 Facilidad de Uso**: Incluye burbujas de ayuda con lenguaje sencillo ("Hola Mamá") para guiar a la usuaria en cada paso.
- **📦 Soporte Multimedida**: Permite calcular utilizando **gramos** (para ingredientes) y **unidades** (para envases, cucharillas, etc.).
- **💾 Sin Base de Datos**: Utiliza `localStorage` para guardar ingredientes y recetas directamente en el navegador de forma segura.

## 🚀 Despliegue Rápido (GitHub Pages)

Este proyecto está construido con **JavaScript puro**, lo que facilita su despliegue en menos de 2 minutos:

1. Crea un repositorio en GitHub.
2. Sube los archivos: `index.html`, `css/`, y `js/`.
3. Ve a **Settings > Pages** en tu repositorio.
4. Selecciona la rama `main` y haz clic en **Save**.
5. ¡Listo! Tu calculadora estará online en `https://tu-usuario.github.io/tu-repo/`.

## 🛠️ Estructura del Proyecto

El código sigue una arquitectura modular de separación de preocupaciones:

- `js/logic/calculadora.js`: Lógica pura de cálculos matemáticos.
- `js/services/bcv.js`: Servicio de obtención de tasa cambiaria (Scraping + Proxy).
- `js/ui/handlers.js`: Gestión de eventos y renderizado de la interfaz.
- `css/styles.css`: Sistema de diseño responsivo y estética visual.

## 📄 Licencia

Este proyecto es de código abierto. ¡Siéntete libre de usarlo para impulsar tu propio negocio familiar! ❤️
