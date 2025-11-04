const CLE_API = 'cdecf0112544cb92e07568739cdf9aa0';
const URL_BASE = 'https://api.openweathermap.org/data/2.5';

/**
 * Récupère la météo actuelle pour une ville
 * @param {string} ville - Nom de la ville
 * @returns {Promise<Object|null>} Données météo ou null en cas d'erreur
 */
export async function obtenirMeteoActuelle(ville) {
  try {
    const url = `${URL_BASE}/weather?q=${ville}&appid=${CLE_API}&units=metric&lang=fr`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Météo actuelle pour', ville, ':', data);
    
    return {
      ville: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidite: data.main.humidity,
      vitesseVent: data.wind.speed,
      icone: data.weather[0].icon
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la météo:', error);
    return null;
  }
}

/**
 * Récupère la météo par coordonnées GPS
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object|null>} Données météo ou null en cas d'erreur
 */
export async function obtenirMeteoParCoordonnees(latitude, longitude) {
  try {
    console.log('Coordonnées:', { latitude, longitude });
    const url = `${URL_BASE}/weather?lat=${latitude}&lon=${longitude}&appid=${CLE_API}&units=metric&lang=fr`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Météo pour les coordonnées:', data);
    
    return {
      ville: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidite: data.main.humidity,
      vitesseVent: data.wind.speed,
      icone: data.weather[0].icon
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la météo par coordonnées:', error);
    return null;
  }
}

/**
 * Récupère les prévisions météo sur plusieurs jours
 * @param {string} ville - Nom de la ville
 * @param {number} jours - Nombre de jours (par défaut 5)
 * @returns {Promise<Array|null>} Tableau de prévisions ou null en cas d'erreur
 */
export async function obtenirPrevisions(ville, jours = 5) {
  try {
    const url = `${URL_BASE}/forecast?q=${ville}&appid=${CLE_API}&units=metric&lang=fr&cnt=${jours * 8}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Prévisions pour', ville, ':', data);
    
    return data.list.map(item => ({
      date: new Date(item.dt * 1000),
      temperature: item.main.temp,
      description: item.weather[0].description,
      humidite: item.main.humidity,
      vitesseVent: item.wind.speed,
      icone: item.weather[0].icon
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des prévisions:', error);
    return null;
  }
}
