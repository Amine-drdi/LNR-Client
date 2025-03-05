import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import axios from 'axios';

ChartJS.register(...registerables);

const ProgressionChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
});
const [error, setError] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/contrats/months');
            const data = response.data;

            const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            const contractData = new Array(12).fill(0); // Prépare un tableau de 12 mois

            data.forEach(item => {
                const monthIndex = item._id.month - 1; // Mois retourné (de 1 à 12) -> index (0-11)
                contractData[monthIndex] += item.count;
            });

            setChartData({
                labels: months,
                datasets: [
                    {
                        label: 'Contrats signés',
                        data: contractData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
            setError('Erreur lors de la récupération des données.');
        }
    };

    fetchData();
}, []);

if (error) {
    return <div>{error}</div>;
}


    return (
        <div style={{ width: '80%', height: '500px' }}>
            <h2>Variation des contrats signés par mois</h2>
            <Chart type="bar" data={chartData} />
        </div>
    );
};

export default ProgressionChart;
