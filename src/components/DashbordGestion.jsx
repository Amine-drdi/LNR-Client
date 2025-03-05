import React, { useEffect, useState } from 'react';
import { FaFileContract } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaEuroSign } from "react-icons/fa";
import ChartComponent from './ChartComponent';
import DashChart from './DashChart';
const DashboardGestion = () => {
  const [contratsAujourdHui, setContratsAujourdHui] = useState(0);
  const [pourcentageProgression, setPourcentageProgression] = useState(0);
  const [table, setTable] = useState(1);
  const [todayCountEvent, setTodayCountEvent] = useState(0);
  const [pourcentageProgressionEvent, setPourcentageProgressionEvent] = useState("0%");
  const [todayCountRDV, setTodayCountRDV] = useState(0);
  const [pourcentageProgressionRDV, setPourcentageProgressionRDV] = useState("0%");
  const [totalMontantVP, setTotalMontantVP] = useState(0); // Ajout de l'état pour le montant VP
  const [pourcentageProgressionVP, setPourcentageProgressionVP] = useState("0%"); // Ajout de l'état pour la progression VP

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
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://51.83.69.195:5000/api/contrats/today');
      const data = await response.json();
      setContratsAujourdHui(data.todayCount);

      const progression = data.yesterdayCount
        ? ((data.todayCount - data.yesterdayCount) / data.yesterdayCount) * 100
        : 0;
      setPourcentageProgression(progression);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/events/stats/today');
        const data = await response.json();

        setTodayCountEvent(data.todayCountEvent);
        setPourcentageProgressionEvent(data.pourcentageProgressionEvent);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      }
    };
    fetchStats();
  }, []);
  useEffect(() => {
    const fetchRDVStats = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/rdv/stats/today');
        const data = await response.json();

        setTodayCountRDV(data.todayCountRDV);
        setPourcentageProgressionRDV(data.pourcentageProgressionRDV);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques RDV :", error);
      }
    };
    fetchRDVStats();
  }, []);
  // Appel pour obtenir les statistiques de cotisation mensuelle
  useEffect(() => {
    const fetchCotisationStats = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/contrats/stats/monthly-cotisation');
        const data = await response.json();

        setTotalMontantVP(data.totalCotisationCurrentMonth);
        setPourcentageProgressionVP(data.cotisationProgression);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques de cotisation :", error);
      }
    };
    fetchCotisationStats();
  }, []);

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
      title: 'Montant VP',
      value: totalMontantVP, // Utilisation de l'état montantVP
      percentage: pourcentageProgressionVP, // Utilisation de l'état pourcentageProgressionVP
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
    </div>
  );
};
const DashboardCard = ({ title, value, percentage, icon, trend }) => {
  const percentageValue = parseFloat(percentage);
  return (
    <div className='pl-4'>
    <div className="bg-blue-gray-500 shadow rounded-lg  p-4 h-auto w-72">
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
          percentageValue > 0 ? 'font-semibold text-2xl text-green-800' : percentageValue < 0 ? 'font-semibold text-2xl text-red-500' : 'font-semibold text-2xl text-white'
        }`}
      >
        {percentage} {percentageValue > 0 ? '▲' : percentageValue < 0 ? '▼' : ''}
      </div>
    </div>
    </div>
  );
};
export default DashboardGestion;
