// Elementos del DOM
const cityInput = document.getElementById('cityInput');
const countryInput = document.getElementById('countryInput');
const countrySuggestions = document.getElementById('countrySuggestions');
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
const windGust = document.getElementById('windGust');
const precipitation = document.getElementById('precipitation');
const airQuality = document.getElementById('airQuality');
const aqiIndex = document.getElementById('aqiIndex');
const pollutantDetails = document.getElementById('pollutantDetails');
const pm25 = document.getElementById('pm25');
const pm10 = document.getElementById('pm10');
const o3 = document.getElementById('o3');
const no2 = document.getElementById('no2');

// Configuración
const API_KEY = window.APP_CONFIG?.API_KEY || '';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const AIR_QUALITY_API_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

// Validar que API_KEY existe
if (!API_KEY) {
    console.error('⚠️ API_KEY no configurada. Abre src/config.js y agrega tu API Key.');
}

// Variables globales
let isOnline = navigator.onLine;
let allCountries = []; // Almacena todos los países
let selectedCountryCode = ''; // Almacena el código del país seleccionado

// Constantes para mensajes de error
const ERROR_MESSAGES = {
    NO_CONNECTION: 'Sin conexión a Internet. Verifica tu WiFi o datos móviles.',
    CONNECTION_RESTORED: 'Conexión restablecida ✓',
    GENERIC_ERROR: 'Error de conexión. Por favor, intenta nuevamente.'
};

// Mostrar notificación de estado de conexión
function showConnectionStatus(online) {
    const message = online 
        ? ERROR_MESSAGES.CONNECTION_RESTORED
        : ERROR_MESSAGES.NO_CONNECTION;
    
    showError(message);
    
    if (online) {
        // Limpiar el mensaje de conexión restablecida después de 3 segundos
        setTimeout(() => {
            clearError();
        }, 3000);
    }
}

// Event listeners para cambios de conectividad
window.addEventListener('online', () => {
    isOnline = true;
    showConnectionStatus(true);
    console.log('📡 Conexión restablecida');
});

window.addEventListener('offline', () => {
    isOnline = false;
    showConnectionStatus(false);
    console.log('📡 Sin conexión a Internet');
});

// Función para cargar países de respaldo
function loadFallbackCountries() {
    allCountries = [
        { code: 'US', name: 'Estados Unidos' },
        { code: 'ES', name: 'España' },
        { code: 'AR', name: 'Argentina' },
        { code: 'BR', name: 'Brasil' },
        { code: 'MX', name: 'México' }
    ];
}


async function loadCountries() {
    try {
        // Si no hay conexión, usar directamente los países de respaldo
        if (!navigator.onLine) {
            console.warn('Sin conexión. Usando países de respaldo.');
            loadFallbackCountries();
            return;
        }

        const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,translations');
        const data = await response.json();

        // Transformar datos: extraer código y nombre en español
        allCountries = data.map(country => {
            return {
                code: country.cca2,
                name: country.translations?.spa?.common || country.name?.common || country.cca2
            };
        });

        // Ordenar alfabéticamente
        allCountries.sort((a, b) => a.name.localeCompare(b.name, 'es'));

    } catch (error) {
        console.error("Error cargando países desde API:", error);
        loadFallbackCountries();
    }
}

// Ejecutar carga de países cuando el DOM esté listo
loadCountries();

// Función para filtrar y mostrar sugerencias de países
function showCountrySuggestions(inputValue) {
    countrySuggestions.innerHTML = '';
    
    if (!inputValue.trim()) {
        countrySuggestions.style.display = 'none';
        return;
    }

    const searchTerm = inputValue.toLowerCase().trim();
    const filtered = allCountries.filter(country => 
        country.name.toLowerCase().includes(searchTerm) ||
        country.code.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        countrySuggestions.style.display = 'none';
        return;
    }

    filtered.forEach((country, index) => {
        const li = document.createElement('li');
        li.textContent = `${country.name} (${country.code})`;
        li.dataset.code = country.code;
        li.dataset.name = country.name;
        li.className = country.code === selectedCountryCode ? 'selected' : '';
        
        li.addEventListener('click', () => selectCountry(country.code, country.name));
        li.addEventListener('mouseover', () => {
            document.querySelectorAll('.country-suggestions li').forEach(item => 
                item.classList.remove('highlighted')
            );
            li.classList.add('highlighted');
        });
        
        countrySuggestions.appendChild(li);
    });

    countrySuggestions.style.display = 'block';
}

// Función para seleccionar un país
function selectCountry(code, name) {
    selectedCountryCode = code;
    countryInput.value = name;
    countrySuggestions.style.display = 'none';
}

// Event listeners para el input de país
countryInput.addEventListener('input', (e) => {
    showCountrySuggestions(e.target.value);
});

countryInput.addEventListener('focus', (e) => {
    if (e.target.value.trim()) {
        showCountrySuggestions(e.target.value);
    }
});

// Cerrar sugerencias al hacer clic fuera
document.addEventListener('click', (e) => {
    if (e.target !== countryInput && !e.target.closest('.country-suggestions')) {
        countrySuggestions.style.display = 'none';
    }
});

// Cerrar sugerencias con Escape
countryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        countrySuggestions.style.display = 'none';
    }
});

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
    const country = selectedCountryCode;

    if (!city) {
        showError('Por favor, ingresa una ciudad');
        return;
    }

    if (!country) {
        showError('Por favor, selecciona un país');
        return;
    }

    // Verificar conexión antes de buscar
    if (!navigator.onLine) {
        showError(ERROR_MESSAGES.NO_CONNECTION);
        return;
    }

    // Construir búsqueda: "ciudad,código_país"
    const searchQuery = `${city},${country}`;

    clearError();
    fetchWeatherData(searchQuery);
}

// Obtener datos del clima desde la API
async function fetchWeatherData(city) {
    try {
        showLoading(true);

        // Verificar conexión antes de hacer la petición
        if (!navigator.onLine) {
            showError(ERROR_MESSAGES.NO_CONNECTION);
            showLoading(false);
            return;
        }

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
        // Obtener también datos de calidad del aire
        await fetchAirQualityData(data.coord.lat, data.coord.lon);
        updateWeatherUI(data);
        showLoading(false);

    } catch (error) {
        console.error('Error:', error);
        // Diferenciar entre error de red y otros errores
        if (!navigator.onLine) {
            showError(ERROR_MESSAGES.NO_CONNECTION);
        } else {
            showError(ERROR_MESSAGES.GENERIC_ERROR);
        }
        showLoading(false);
    }
}

// Obtener datos de calidad del aire
async function fetchAirQualityData(lat, lon) {
    try {
        const url = `${AIR_QUALITY_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.warn('No se pudo obtener datos de calidad del aire');
            return;
        }

        const data = await response.json();
        updateAirQualityUI(data);
    } catch (error) {
        console.error('Error al obtener calidad del aire:', error);
    }
}

// Actualizar UI con datos de calidad del aire
function updateAirQualityUI(data) {
    const { list } = data;
    if (!list || list.length === 0) return;

    const current = list[0];
    const aqi = current.main.aqi; // 1-5 (1=Excelente, 5=Muy pobre)
    const components = current.components;

    // Mapear AQI a descripción
    const aqiDescriptions = {
        1: 'Excelente',
        2: 'Buena',
        3: 'Moderada',
        4: 'Deficiente',
        5: 'Muy pobre'
    };

    const aqiColors = {
        1: '#10b981', // Verde
        2: '#84cc16', // Verde claro
        3: '#eab308', // Amarillo
        4: '#f97316', // Naranja
        5: '#dc2626'  // Rojo
    };

    airQuality.textContent = aqiDescriptions[aqi] || 'Desconocida';
    airQuality.style.color = aqiColors[aqi] || '#fff';
    aqiIndex.textContent = aqi;

    // Actualizar detalles de contaminantes
    pm25.textContent = components.pm2_5 ? components.pm2_5.toFixed(1) + ' µg/m³' : '--';
    pm10.textContent = components.pm10 ? components.pm10.toFixed(1) + ' µg/m³' : '--';
    o3.textContent = components.o3 ? components.o3.toFixed(1) + ' µg/m³' : '--';
    no2.textContent = components.no2 ? components.no2.toFixed(1) + ' µg/m³' : '--';

    // Mostrar sección de detalles
    pollutantDetails.style.display = 'block';
}

// Actualizar UI con datos del clima
function updateWeatherUI(data) {
    const {
        name,
        main: { temp, humidity: humid },
        weather: [{ icon, description }],
        wind: { speed, gust },
        sys: { sunrise, sunset },
        dt,
        rain,
        snow
    } = data;

    cityName.textContent = name;
    temperature.textContent = `${Math.round(temp)}°C`;
    weatherDescription.textContent = description;
    humidity.textContent = `${humid}%`;
    windSpeed.textContent = `${speed.toFixed(1)} m/s`;
    windGust.textContent = gust ? `${gust.toFixed(1)} m/s` : '-- m/s';

    // Calcular precipitación total (lluvia + nieve)
    const rainAmount = rain?.['1h'] || 0;
    const snowAmount = snow?.['1h'] || 0;
    const totalPrecipitation = rainAmount + snowAmount;
    
    if (totalPrecipitation > 0) {
        precipitation.textContent = `${totalPrecipitation.toFixed(1)} mm`;
    } else {
        precipitation.textContent = '0 mm';
    }

    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
    weatherIcon.onerror = () => {
        weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    };

    weatherCard.style.display = 'block';
    weatherCard.style.animation = 'slideUp 0.6s ease';

    // El icono ya tiene la información correcta de día/noche de la ciudad
    // Usamos eso como fuente de verdad
    const timeOfDay = getTimeOfDay(icon, dt, sunrise, sunset);
    applyTheme(timeOfDay);

    console.log(`🌍 ${name} - Icon: ${icon} | Theme: ${timeOfDay}`);
}

// Determinar si es día, tarde o noche
// El icono termina en 'd' (día) o 'n' (noche) - OpenWeatherMap calcula esto correctamente
function getTimeOfDay(iconCode, currentTime, sunrise, sunset) {
    const isNight = iconCode.endsWith('n');

    if (isNight) {
        return 'night'; // 🌙 Noche
    }

    // Es de día - ahora diferenciamos entre mañana y tarde
    // Calculamos si estamos en la primera mitad del día (mañana) o segunda mitad (tarde)
    const dayDuration = sunset - sunrise;
    const sunriseMiddle = sunrise + (dayDuration / 2); // Mediodía astronómico

    if (currentTime < sunriseMiddle) {
        return 'morning'; // 🌅 Mañana
    }
    return 'afternoon'; // ☀️ Tarde/Día
}

// Aplicar tema según hora del día
function applyTheme(timeOfDay) {
    const background = document.querySelector('.background');

    // Remover todas las clases de tema
    background.classList.remove('theme-morning', 'theme-afternoon', 'theme-night');

    // Agregar la clase correspondiente
    background.classList.add(`theme-${timeOfDay}`);
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
        
        // Verificar conexión antes de hacer la petición
        if (!navigator.onLine) {
            showError(ERROR_MESSAGES.NO_CONNECTION);
            showLoading(false);
            return;
        }
        
        const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al obtener datos de clima');
        }

        const data = await response.json();
        await fetchAirQualityData(lat, lon);
        updateWeatherUI(data);
        showLoading(false);

    } catch (error) {
        console.error('Error:', error);
        // Diferenciar entre error de red y otros errores
        if (!navigator.onLine) {
            showError(ERROR_MESSAGES.NO_CONNECTION);
        } else {
            showError(ERROR_MESSAGES.GENERIC_ERROR);
        }
        showLoading(false);
    }
}

// Descomenta para obtener clima por geolocalización al cargar
// getWeatherByGeolocation();
