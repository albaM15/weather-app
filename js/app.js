// Elementos del DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

// Configuración
const API_KEY = window.APP_CONFIG?.API_KEY || '';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Validar que API_KEY existe
if (!API_KEY) {
    console.error('⚠️ API_KEY no configurada. Abre js/config.js y agrega tu API Key.');
}

// Eventos principales
searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Función principal: búsqueda
function handleSearch() {
    const city = cityInput.value.trim();

    if (!city) {
        showError('Por favor, ingresa una ciudad');
        return;
    }

    clearError();
    fetchWeatherData(city);
}

// Obtener datos del clima desde la API
async function fetchWeatherData(city) {
    try {
        showLoading(true);

        const url = `${API_BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                showError('Ciudad no encontrada. Verifica el nombre e intenta nuevamente.');
            } else {
                showError('Error al obtener datos del clima. Intenta más tarde.');
            }
            showLoading(false);
            return;
        }

        const data = await response.json();
        updateWeatherUI(data);
        showLoading(false);

    } catch (error) {
        console.error('Error:', error);
        showError('Error de conexión. Verifica tu conexión a internet.');
        showLoading(false);
    }
}

// Actualizar UI con datos del clima
function updateWeatherUI(data) {
    const {
        name,
        main: { temp, humidity: humid },
        weather: [{ description, icon }],
        wind: { speed }
    } = data;

    cityName.textContent = name;
    temperature.textContent = `${Math.round(temp)}°C`;
    weatherDescription.textContent = description;
    humidity.textContent = `${humid}%`;
    windSpeed.textContent = `${speed.toFixed(1)} m/s`;

    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    weatherIcon.alt = description;

    weatherCard.style.display = 'block';
    weatherCard.style.animation = 'slideUp 0.6s ease';
}

// Mostrar error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    weatherCard.style.display = 'none';
}

// Limpiar error
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

// Mostrar/ocultar spinner de carga
function showLoading(isLoading) {
    loadingSpinner.style.display = isLoading ? 'flex' : 'none';
}

// Hacer foco en el input al cargar
window.addEventListener('DOMContentLoaded', () => {
    cityInput.focus();
});

// Geolocalización (opcional)
function getWeatherByGeolocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                console.log('Geolocalización deshabilitada:', error);
            }
        );
    }
}

async function fetchWeatherByCoordinates(lat, lon) {
    try {
        showLoading(true);
        const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al obtener datos de clima');
        }

        const data = await response.json();
        updateWeatherUI(data);
        showLoading(false);

    } catch (error) {
        console.error('Error:', error);
        showLoading(false);
    }
}

// Descomenta para obtener clima por geolocalización al cargar
// getWeatherByGeolocation();
