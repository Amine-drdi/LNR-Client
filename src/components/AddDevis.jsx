import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const AddDevis = () => {
  const NOMS_MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const [mois, setMois] = useState(new Date().getMonth());
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [nombreDeJours, setNombreDeJours] = useState([]);
  const [joursVides, setJoursVides] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [titreEvenement, setTitreEvenement] = useState('');
  const [dateEvenement, setDateEvenement] = useState('');
  const [themeEvenement, setThemeEvenement] = useState('bleu');
  const [ouvrirModalEvenement, setOuvrirModalEvenement] = useState(false);
  const [modifierEvenementId, setModifierEvenementId] = useState(null);

  useEffect(() => {
    obtenirNombreDeJours();
  }, [mois, annee]);

  const estAujourdHui = (date) => {
    const aujourdHui = new Date();
    const d = new Date(annee, mois, date);
    return aujourdHui.toDateString() === d.toDateString();
  };

  const afficherModalEvenement = (date) => {
    setOuvrirModalEvenement(true);
    setDateEvenement(new Date(annee, mois, date).toDateString());
    setModifierEvenementId(null);
  };

 

 
  const obtenirNombreDeJours = () => {
    const joursDansMois = new Date(annee, mois + 1, 0).getDate();
    const jourSemaine = new Date(annee, mois, 1).getDay();
    const arrayJoursVides = Array.from({ length: jourSemaine === 0 ? 6 : jourSemaine - 1 }, (_, i) => i + 1);
    const arrayJours = Array.from({ length: joursDansMois }, (_, i) => i + 1);
    setJoursVides(arrayJoursVides);
    setNombreDeJours(arrayJours);
  };
  return (
    <div className="antialiased sans-serif  bg-white h-screen">
            <h2 className="text-2xl font-bold text-blue-gray-700 pt-4">Agenda des devis</h2>
      <div className="container mx-auto px-4 py-2 md:py-12">
        <div className="bg-blue rounded-lg border   shadow overflow-hidden">
          <div className="flex items-center  justify-between py-2 px-6">
            <div>
              <span className="text-lg font-bold text-gray-800">{NOMS_MOIS[mois]}</span>
              <span className="ml-1 text-lg text-gray-600 font-normal">{annee}</span>
            </div>
            <div className="border  rounded-lg px-1" style={{ paddingTop: '2px' }}>
              <button
                type="button"
                className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center ${mois === 0 && 'cursor-not-allowed opacity-25'}`}
                onClick={() => {
                  if (mois > 0) {
                    setMois(mois - 1);
                  } else {
                    setMois(11);
                    setAnnee(annee - 1);
                  }
                }}
              >
                <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="border-r inline-flex h-6"></div>
              <button
                type="button"
                className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1 ${mois === 11 && 'cursor-not-allowed opacity-25'}`}
                onClick={() => {
                  if (mois < 11) {
                    setMois(mois + 1);
                  } else {
                    setMois(0);
                    setAnnee(annee + 1);
                  }
                }}
              >
                <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="-mx-1 -mb-1 ">
            <div className="flex flex-wrap " style={{ marginBottom: '-40px' }}>
              {JOURS.map((jour, index) => (
                <div key={index} style={{ width: '14.26%' }} className="px-2 py-2">
                  <div className="text-gray-600 text-sm uppercase tracking-wide font-bold text-center">{jour}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap border-t border-l">
              {joursVides.map((_, index) => (
                <div key={index} style={{ width: '14.28%', height: '120px' }} className="text-center border-r border-b px-4 pt-2"></div>
              ))}
              {nombreDeJours.map((date, index) => (
                <div key={index} style={{ width: '14.28%', height: '120px' }} className="px-4 pt-2 border-r border-b relative text-right">
                  <span
                    className={`block w-6 h-6 rounded-full leading-none text-center ${estAujourdHui(date) ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => afficherModalEvenement(date)}
                  >
                    {date}
                  </span>
                  <div className="absolute left-0 right-0 top-8 overflow-y-auto">
                    {Array.isArray(evenements) && evenements
                      .filter(evenement => new Date(evenement.date_evenement).getDate() === date)
                      .map((evenement, index) => (
                        <div
                          key={index}
                          className={`mt-2 p-1 rounded border ${evenement.theme_evenement === 'bleu' ? 'border-blue-200 text-blue-600' : 'border-red-200 text-red-600'} text-sm`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{evenement.titre_evenement}</span>
                            <button
                              onClick={() => supprimerEvenement(evenement._id)}
                              className="text-xs text-red-500"
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter ou modifier un événement */}
      {ouvrirModalEvenement && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h3 className="text-lg font-semibold mb-4">{modifierEvenementId ? 'Modifier l\'événement' : 'Ajouter un événement'}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ajouterOuModifierEvenement();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="titreEvenement">
                  Titre
                </label>
                <input
                  type="text"
                  id="titreEvenement"
                  value={titreEvenement}
                  onChange={(e) => setTitreEvenement(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="dateEvenement">
                  Date
                </label>
                <input
                  type="text"
                  id="dateEvenement"
                  value={dateEvenement}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="themeEvenement">
                  Thème
                </label>
                <select
                  id="themeEvenement"
                  value={themeEvenement}
                  onChange={(e) => setThemeEvenement(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="bleu">Bleu</option>
                  <option value="rouge">Rouge</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setOuvrirModalEvenement(false)}
                  className="bg-red-600 hover:bg-red-800  text-white px-4 py-2 rounded mr-2"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                 
                  className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded"
                >
                  {modifierEvenementId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDevis;
