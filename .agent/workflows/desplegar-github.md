---
description: Cómo subir el proyecto a GitHub y activar la calculadora online
---

Sigue estos pasos para subir tu proyecto a GitHub y habilitar la página web para que tu mamá pueda usarla desde cualquier lugar:

### 1. Crear el repositorio en GitHub
1. Ve a [GitHub](https://github.com/new) e inicia sesión.
2. Ponle un nombre al repositorio, por ejemplo: `calculadora-yogures`.
3. Déjalo como **Public** (Público).
4. **IMPORTANTE**: No selecciones nada en "Initialize this repository with..." (ni README, ni .gitignore).
5. Haz clic en **Create repository**.

### 2. Conectar tu carpeta local con GitHub
Copia y pega estos comandos en tu terminal (PowerShell o CMD) dentro de la carpeta `calculadora-yogures`:

```powershell
# Cambia 'USUARIO' por tu nombre de usuario de GitHub
git remote add origin https://github.com/USUARIO/calculadora-yogures.git
git branch -M main
git push -u origin main
```
*(GitHub te pedirá que inicies sesión la primera vez).*

### 3. Activar GitHub Pages (La página web)
1. Una vez subido el código, ve a la pestaña **Settings** (Ajustes) de tu repositorio en GitHub.
2. En el menú de la izquierda, haz clic en **Pages**.
3. En la sección "Build and deployment", asegúrate de que diga **Deploy from a branch**.
4. En "Branch", selecciona **main** y la carpeta **/(root)**.
5. Haz clic en **Save**.

¡Listo! En un par de minutos aparecerá un enlace arriba que dice algo como `https://USUARIO.github.io/calculadora-yogures/`. **Ese es el enlace que le debes pasar a tu mamá.**
