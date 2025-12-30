# 🌤️ Weather App

Una aplicación moderna y elegante para consultar el clima en tiempo real con una interfaz glassmorphism y totalmente responsive.

🔗 **[Visita la App Oficial](https://my-weather-pro.vercel.app/)**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![OpenWeatherMap API](https://img.shields.io/badge/OpenWeatherMap-API-orange?style=for-the-badge)

---

## ✨ Características

- 🎨 **Diseño Moderno** - Interfaz glassmorphism minimalista
- 📱 **100% Responsive** - Funciona perfecto en móvil, tablet y desktop
- 🌡️ **Clima en Tiempo Real** - Integración con OpenWeatherMap API
- 🔍 **Búsqueda por Ciudad** - Busca el clima de cualquier ciudad
- 💨 **Información Completa** - Temperatura, humedad, velocidad del viento
- 🎭 **Iconos Dinámicos** - Icono del clima actualizado automáticamente
- ⌨️ **Búsqueda por Enter** - Presiona Enter para buscar
- 🔐 **API Key Segura** - No se expone en Git
- ✨ **Animaciones Suaves** - Transiciones fluidas y profesionales
- 🌈 **Gradiente Animado** - Fondo con efecto degradado dinámico

---

## 🚀 Inicio Rápido

### Instalación

```bash
git clone https://github.com/albaM15/weather-app.git
cd weather-app
npm install
```

### Ejecutar Localmente

```bash
npm start
```

Luego abre **http://localhost:8000** en tu navegador.

---

## 🔧 Configuración

### 1. Obtener API Key

1. Ve a [OpenWeatherMap](https://openweathermap.org/api)
2. Regístrate y crea una cuenta gratuita
3. Ve a "API Keys" y copia tu clave

### 2. Agregar la API Key

Edita el archivo `js/config.js`:

```javascript
window.APP_CONFIG = {
    API_KEY: 'TU_API_KEY_AQUI'  // ← Reemplaza con tu clave
};
```

⚠️ **Importante**: El archivo `js/config.js` está en `.gitignore` y **NO se subirá a GitHub**

---

## 📁 Estructura del Proyecto

```
weather-app/
├── 📄 index.html           # Archivo HTML principal
├── 📁 css/
│   └── styles.css         # Estilos (Glassmorphism, responsive)
├── 📁 js/
│   ├── config.js          # Configuración de API (NO se sube a Git)
│   └── app.js             # Lógica principal
├── 📄 package.json        # Dependencias npm
├── 📄 .gitignore          # Archivos ignorados en Git
├── 📄 server.js           # Servidor Node.js (alternativa)
├── 📄 start.sh            # Script para iniciar (Linux/Mac)
└── 📄 README.md           # Este archivo
```

---

## 🎯 Cómo Usar

1. **Ingresa una ciudad** en el campo de búsqueda
2. **Presiona el botón "Buscar"** o presiona **Enter**
3. **Verás el clima actualizado** con:
   - 🌡️ Temperatura actual en °C
   - 💧 Humedad en porcentaje
   - 💨 Velocidad del viento en m/s
   - 🎭 Icono descriptivo del clima

---

## 💻 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Glassmorphism, Flexbox/Grid, animaciones
- **JavaScript (ES6+)** - Lógica sin frameworks
- **OpenWeatherMap API** - Datos en tiempo real
- **http-server** - Servidor local
- **npm** - Gestor de paquetes

---


## 📝 Scripts Disponibles

```bash
npm start    # Inicia el servidor en localhost:8000
npm run dev  # Alias para start
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes mejoras:

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/mejora`
3. Commit: `git commit -am 'Agrego nueva feature'`
4. Push: `git push origin feature/mejora`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usarlo libremente.

---

## 👨‍💻 Autor

**Alba**
- GitHub: [@alba](https://github.com/tu-usuario)

---

## ⭐ Si te gustó, dale una estrella!

Haz clic en la estrella de GitHub si este proyecto te fue útil. ¡Gracias! 🙏

---

## 📞 Contacto

¿Preguntas o sugerencias? Abre un [issue](https://github.com/tu-usuario/weather-app/issues) en GitHub.

---

**Última actualización**: Diciembre 2025

