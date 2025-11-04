import './styles/main.css';
import { obtenirMeteoActuelle, obtenirMeteoParCoordonnees, obtenirPrevisions } from './services/serviceMeteo';

console.log('Application météo démarrée');

const app = document.getElementById('app');
app.innerHTML = '<h1>Application Météo</h1>';

//Test des fonctions API (décommentez pour tester avec votre clé API)
obtenirMeteoActuelle('Paris');
obtenirMeteoParCoordonnees(48.8566, 2.3522);
obtenirPrevisions('Lyon', 3);
