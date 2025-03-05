// src/components/ChartComponent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const ChartComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mettez à jour l'URL ici
        const response = await axios.get('http://51.83.69.195:5000/api/commercials/ranking');
        setData(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  // Préparation des données pour Chart.js
  const labels = data.map(commercial => commercial.nom);
  const contratsCount = data.map(commercial => commercial.contratsCount);
  const totalCotisation = data.map(commercial => commercial.totalCotisation);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Nombre de Contrats',
        data: contratsCount,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Total des Cotisations',
        data: totalCotisation,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>Classement des Commerciaux</h2>
      <Bar data={chartData} options={{
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }} />
    </div>
  );
};

export default ChartComponent;