import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const CommercialChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupérer les données des commerciaux
    axios.get('/api/contrats/commercials-total')
      .then(response => {
        const data = response.data;

        // Vérifier si la réponse est bien un tableau
        if (Array.isArray(data)) {
          const commercials = data.map(item => item.Commercial || 'Inconnu'); // Gérer les valeurs nulles
          const totalContracts = data.map(item => item.totalContracts);

          // Définir les données pour le graphique
          setChartData({
            labels: commercials,
            datasets: [
              {
                label: 'Nombre de contrats ajoutés',
                data: totalContracts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          });
        } else {
          setError('Les données récupérées ne sont pas valides.');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données:', error);
        setError('Erreur lors de la récupération des données.');
        setLoading(false);
      });
  }, []);

  // Afficher l'erreur si elle existe
  if (error) {
    return <p>{error}</p>;
  }

  // Afficher un message de chargement si les données ne sont pas encore prêtes
  if (loading) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div style={{ width: '80%', height: '500px' }}>
      <h2>Classement des commerciaux selon le nombre de contrats signés</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default CommercialChart;
