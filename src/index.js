import './styles/main.css';
import { obtenirMeteoActuelle } from './services/serviceMeteo';

// Fonction pour afficher les données météo
function afficherMeteo(donnees) {
  if (!donnees) {
    document.getElementById('resultat').innerHTML = `
      <div class="erreur">
        <p>❌ Impossible de récupérer les données météo. Veuillez vérifier le nom de la ville.</p>
      </div>
    `;
    return;
  }

  const resultatDiv = document.getElementById('resultat');
  resultatDiv.innerHTML = `
    <div class="carte-meteo">
      <div class="entete-meteo">
        <h2>${donnees.ville}, ${donnees.pays}</h2>
        <p class="date">${donnees.date.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}</p>
      </div>
      
      <div class="temperature-principale">
        <img src="${donnees.iconeURL}" alt="${donnees.description}" class="icone-meteo">
        <div class="temp-info">
          <span class="temperature">${donnees.temperature}°C</span>
          <p class="description">${donnees.description}</p>
        </div>
      </div>
      
      <div class="details-meteo">
        <div class="detail-item">
          <span class="label">Ressenti</span>
          <span class="valeur">${donnees.ressenti}°C</span>
        </div>
        <div class="detail-item">
          <span class="label">Min / Max</span>
          <span class="valeur">${donnees.temperatureMin}°C / ${donnees.temperatureMax}°C</span>
        </div>
        <div class="detail-item">
          <span class="label">Humidité</span>
          <span class="valeur">${donnees.humidite}%</span>
        </div>
        <div class="detail-item">
          <span class="label">Vent</span>
          <span class="valeur">${donnees.vitesseVent} km/h</span>
        </div>
        <div class="detail-item">
          <span class="label">Pression</span>
          <span class="valeur">${donnees.pression} hPa</span>
        </div>
        <div class="detail-item">
          <span class="label">Lever du soleil</span>
          <span class="valeur">${donnees.lever}</span>
        </div>
        <div class="detail-item">
          <span class="label">Coucher du soleil</span>
          <span class="valeur">${donnees.coucher}</span>
        </div>
      </div>
    </div>
  `;
}

// Initialisation de l'application
const app = document.getElementById('app');
app.innerHTML = `
  <div class="container">
    <h1>🌤️ Application Météo</h1>
    
    <form id="formulaire-meteo" class="formulaire-recherche">
      <input 
        type="text" 
        id="input-ville" 
        placeholder="Entrez le nom d'une ville..." 
        required
        autocomplete="off"
      >
      <button type="submit">Rechercher</button>
    </form>
    
    <div id="resultat"></div>
  </div>
`;

// Gestion de la soumission du formulaire
const formulaire = document.getElementById('formulaire-meteo');
const inputVille = document.getElementById('input-ville');

formulaire.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const ville = inputVille.value.trim();
  
  if (!ville) return;
  
  // Afficher un loader
  document.getElementById('resultat').innerHTML = '<div class="loader">Chargement...</div>';
  
  // Récupérer et afficher les données
  const donnees = await obtenirMeteoActuelle(ville);
  afficherMeteo(donnees);
});

