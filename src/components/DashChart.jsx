import React, { useEffect, useState } from 'react';
import {Bar } from 'react-chartjs-2';
import axios from 'axios';

const DashChart = () => {
  const [chartData, setChartData] = useState(null);  // Initialisez avec null pour vérifier plus tard

  useEffect(() => {
    axios.get('http://51.83.69.195:5000/api/events/ranking')
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          const labels = response.data.map(item => item._id || "Inconnu");
          const data = response.data.map(item => item.count || 0);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Nombre d\'événements ajoutés',
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
              }
            ]
          });
        } else {
          console.error("Données inattendues :", response.data);
        }
      })
      .catch(error => console.error("Erreur lors de la récupération des données:", error));
  }, []);

  // Affiche un message de chargement ou d'erreur si chartData est null
  if (!chartData) {
    return <p>Chargement des données...</p>;
  }

  return (
<div className="flex justify-center items-center h-full w-full mt-8">
  <div className="w-2/3">
    <h2 className="text-center">Classement des Agents Prise de RDV</h2>
    <Bar data={chartData} />
  </div>
</div>

  );
};

export default DashChart;
