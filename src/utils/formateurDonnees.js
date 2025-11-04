/**
 * Formate l'URL complète de l'icône météo
 * @param {string} codeIcone - Code de l'icône (ex: "01d")
 * @returns {string} URL complète de l'icône
 */
export function formaterIconeURL(codeIcone) {
  return `https://openweathermap.org/img/wn/${codeIcone}@2x.png`;
}

/**
 * Capitalise la première lettre d'une chaîne
 * @param {string} texte - Texte à capitaliser
 * @returns {string} Texte avec première lettre en majuscule
 */
function capitaliser(texte) {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/**
 * Formate les données de météo actuelle
 * @param {Object} donneesAPI - Données brutes de l'API
 * @returns {Object} Données formatées et prêtes à afficher
 */
export function formaterMeteoActuelle(donneesAPI) {
  return {
    ville: donneesAPI.name,
    pays: donneesAPI.sys.country,
    temperature: Math.round(donneesAPI.main.temp),
    ressenti: Math.round(donneesAPI.main.feels_like),
    temperatureMin: Math.round(donneesAPI.main.temp_min),
    temperatureMax: Math.round(donneesAPI.main.temp_max),
    description: capitaliser(donneesAPI.weather[0].description),
    humidite: donneesAPI.main.humidity,
    vitesseVent: Math.round(donneesAPI.wind.speed * 3.6), // Conversion m/s en km/h
    pression: donneesAPI.main.pressure,
    icone: donneesAPI.weather[0].icon,
    iconeURL: formaterIconeURL(donneesAPI.weather[0].icon),
    lever: new Date(donneesAPI.sys.sunrise * 1000).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    coucher: new Date(donneesAPI.sys.sunset * 1000).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    date: new Date()
  };
}

/**
 * Formate les données de prévisions météo
 * @param {Object} donneesAPI - Données brutes de l'API (forecast)
 * @returns {Array} Tableau de prévisions groupées par jour
 */
export function formaterPrevisions(donneesAPI) {
  const previsionsParJour = {};
  
  // Grouper les prévisions par jour
  donneesAPI.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const jour = date.toLocaleDateString('fr-FR');
    
    if (!previsionsParJour[jour]) {
      previsionsParJour[jour] = {
        date: date,
        temperatures: [],
        descriptions: [],
        humidites: [],
        vents: [],
        icones: []
      };
    }
    
    previsionsParJour[jour].temperatures.push(item.main.temp);
    previsionsParJour[jour].descriptions.push(item.weather[0].description);
    previsionsParJour[jour].humidites.push(item.main.humidity);
    previsionsParJour[jour].vents.push(item.wind.speed);
    previsionsParJour[jour].icones.push(item.weather[0].icon);
  });
  
  // Formater chaque jour
  return Object.values(previsionsParJour).map(jour => {
    // Trouver la description la plus fréquente
    const descriptionDominante = jour.descriptions
      .sort((a, b) => 
        jour.descriptions.filter(d => d === a).length - 
        jour.descriptions.filter(d => d === b).length
      )
      .pop();
    
    // Trouver l'icône la plus fréquente
    const iconeDominante = jour.icones
      .sort((a, b) => 
        jour.icones.filter(i => i === a).length - 
        jour.icones.filter(i => i === b).length
      )
      .pop();
    
    return {
      date: jour.date,
      jourSemaine: jour.date.toLocaleDateString('fr-FR', { weekday: 'long' }),
      dateComplete: jour.date.toLocaleDateString('fr-FR'),
      temperatureMin: Math.round(Math.min(...jour.temperatures)),
      temperatureMax: Math.round(Math.max(...jour.temperatures)),
      temperatureMoyenne: Math.round(
        jour.temperatures.reduce((a, b) => a + b, 0) / jour.temperatures.length
      ),
      description: capitaliser(descriptionDominante),
      humidite: Math.round(
        jour.humidites.reduce((a, b) => a + b, 0) / jour.humidites.length
      ),
      vitesseVent: Math.round(
        (jour.vents.reduce((a, b) => a + b, 0) / jour.vents.length) * 3.6
      ),
      icone: iconeDominante,
      iconeURL: formaterIconeURL(iconeDominante)
    };
  });
}
