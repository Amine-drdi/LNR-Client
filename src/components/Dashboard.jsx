import React, { useEffect, useState } from 'react';
import { FaFileContract } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { GiDiploma } from "react-icons/gi";
import { FaEuroSign } from "react-icons/fa";
import ChartComponent from './ChartComponent';
import DashChart from './DashChart';
import OPCOchart from './OPCOchart';

const Dashboard = () => {
  const [contratsAujourdHui, setContratsAujourdHui] = useState(0);
  const [pourcentageProgression, setPourcentageProgression] = useState(0);
  const [table, setTable] = useState(1);
  const [todayCountEvent, setTodayCountEvent] = useState(0);
  const [pourcentageProgressionEvent, setPourcentageProgressionEvent] = useState("0%");
  const [todayCountRDV, setTodayCountRDV] = useState(0);
  const [pourcentageProgressionRDV, setPourcentageProgressionRDV] = useState("0%");
  const [totalMontantVP, setTotalMontantVP] = useState(0);
  const [pourcentageProgressionVP, setPourcentageProgressionVP] = useState("0%");

  // Fonction pour récupérer les données de classement des commerciaux
  const getCommercialRanking = async () => {
    try {
      const response = await fetch('http://51.83.69.195:5000/api/commercials/ranking');
      if (!response.ok) throw new Error("Erreur lors de la récupération des données");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du classement des commerciaux :", error);
      return [];
    }
  };

  // Fonction de mise à jour des données
  const fetchData = async () => {
    try {
      const contratsResponse = await fetch('http://51.83.69.195:5000/api/contrats/today');
      const contratsData = await contratsResponse.json();
      setContratsAujourdHui(contratsData.todayCount);
      const progression = contratsData.yesterdayCount
        ? ((contratsData.todayCount - contratsData.yesterdayCount) / contratsData.yesterdayCount) * 100
        : 0;
      setPourcentageProgression(progression);

      const eventStatsResponse = await fetch('http://51.83.69.195:5000/events/stats/today');
      const eventStatsData = await eventStatsResponse.json();
      setTodayCountEvent(eventStatsData.todayCountEvent);
      setPourcentageProgressionEvent(eventStatsData.pourcentageProgressionEvent);

      const rdvStatsResponse = await fetch('http://51.83.69.195:5000/rdv/stats/today');
      const rdvStatsData = await rdvStatsResponse.json();
      setTodayCountRDV(rdvStatsData.todayCountRDV);
      setPourcentageProgressionRDV(rdvStatsData.pourcentageProgressionRDV);

      const cotisationStatsResponse = await fetch('http://51.83.69.195:5000/api/contrats/stats/monthly-cotisation');
      const cotisationStatsData = await cotisationStatsResponse.json();
      setTotalMontantVP(cotisationStatsData.totalCotisationCurrentMonth);
      setPourcentageProgressionVP(cotisationStatsData.cotisationProgression);

    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques :", error);
    }
  };

  useEffect(() => {
    fetchData(); // Appel initial

    const intervalId = setInterval(() => {
      fetchData(); // Appel toutes les 10 secondes
    }, 10000); // 10 secondes

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle à la destruction du composant
  }, []); // Le tableau vide [] garantit que l'effet se lance une seule fois au montage

  const handleStatsCardClick = (index) => setTable(index);

  const stats = [
    {
      title: 'Vente',
      value: contratsAujourdHui,
      percentage: pourcentageProgression.toFixed(2) + "%",
      icon: <FaFileContract className='h-6 w-6' />,
      trend: 'up',
    },
    {
      title: 'Prise de RDV',
      value: todayCountEvent,
      percentage: pourcentageProgressionEvent,
      icon: <BsCalendarDateFill className='h-6 w-6' />,
      trend: 'up',
    },
    {
      title: 'OPCO',
      value: todayCountRDV,
      percentage: pourcentageProgressionRDV,
      icon: <GiDiploma className='h-6 w-6' />,
      trend: 'up',
    },
    {
      title: 'Montant VP',
      value: totalMontantVP,
      percentage: pourcentageProgressionVP,
      icon: <FaEuroSign className='h-6 w-6' />,
      trend: 'up',
    },
  ];

  return (
    <div>
      <div className="flex space-x-4 pb-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>
      <ChartComponent />
      <DashChart/>
      <OPCOchart/>
    </div>
  );
};

const DashboardCard = ({ title, value, percentage, icon, trend }) => {
  const percentageValue = parseFloat(percentage);

  return (
    <div className="bg-blue-gray-500 shadow rounded-lg p-4 h-auto w-56">
      <div className="flex items-center">
        <div className="p-2 bg-white rounded-full">
          {icon}
        </div>
        <div className="ml-4">
          <h4 className="text-white">{title}</h4>
          <div className="text-2xl font-semibold text-white">{value}</div>
        </div>
      </div>
      <div
        className={`mt-2 text-sm ${
          percentageValue > 0
            ? 'font-semibold text-2xl text-green-800'
            : percentageValue < 0
            ? 'font-semibold text-2xl text-red-500'
            : 'font-semibold text-2xl text-white'
        }`}
      >
        {percentage} {percentageValue > 0 ? '▲' : percentageValue < 0 ? '▼' : ''}
      </div>
    </div>
  );
};

export default Dashboard;
