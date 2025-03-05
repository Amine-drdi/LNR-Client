import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function OPCOchart() {
  // Initialiser chartData avec une structure vide pour éviter les erreurs de rendu
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Nombre de RDVs ajoutés',
        data: [],
        backgroundColor: [], // Ajoutez une propriété pour les couleurs de fond
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/rdv-count');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const userNames = data.map(item => item._id || "Inconnu");
          const rdvCounts = data.map(item => item.count || 0);

          // Définir des couleurs de fond dynamiques pour chaque barre
          const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ];
          
          setChartData({
            labels: userNames,
            datasets: [
              {
                label: 'Nombre de RDVs ajoutés',
                data: rdvCounts,
                backgroundColor: colors.slice(0, rdvCounts.length), // Limite les couleurs au nombre de barres
                borderColor: colors.slice(0, rdvCounts.length), // Bordures avec les mêmes couleurs
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.warn("Les données reçues sont vides ou non conformes", data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center h-full w-full mt-8">
      <div className="w-2/3">
        <h2 className="text-center">Classement des Agents OPCO</h2>
        <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
      </div>
    </div>
  );
}

export default OPCOchart;
