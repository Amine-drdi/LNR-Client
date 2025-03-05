import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TablePointage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        const response = await axios.get('http://51.83.69.195:5000/api/status-history');
        setHistory(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des statuts :", error);
      }
    };

    fetchStatusHistory();
  }, []);

  return (
    <div className="p-4  ">
    <h2 className="text-3xl font-semibold text-left text-blue-gray-700 mb-6 border-b pb-4">Pointage</h2>
    <table className="min-w-full bg-gray-100 border border-gray-300 rounded-lg">
    <thead className="bg-blue-gray-500 border-b w-full">
    <tr>
    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider"> Agent</th>
    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date</th>
    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Statut</th>
    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Heure</th>
        </tr>
      </thead>
      <tbody>
  {history.map((user, userIndex) => (
    user.dates.map((dateInfo, dateIndex) => (
      <React.Fragment key={`${userIndex}-${dateIndex}`}>
        <tr className="hover:bg-gray-50 transition-colors border-b border-gray-300">
          <td className="px-4 py-3 text-sm text-gray-700 text-center" rowSpan={dateInfo.statuses.length}>
            <strong>{user.username}</strong>
          </td>
          <td className="px-4 py-3 text-sm text-gray-700 text-center" rowSpan={dateInfo.statuses.length}>
            {dateInfo.date}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700 text-center">{dateInfo.statuses[0].status}</td>
          <td className="px-4 py-3 text-sm text-gray-700 text-center">{dateInfo.statuses[0].time}</td>
        </tr>
        {dateInfo.statuses.slice(1).map((status, statusIndex) => (
          <tr key={`${userIndex}-${dateIndex}-${statusIndex + 1}`} className="border-b border-gray-300">
            <td className="px-4 py-3 text-sm text-gray-700 text-center">{status.status}</td>
            <td className="px-4 py-3 text-sm text-gray-700 text-center">{status.time}</td>
          </tr>
        ))}
      </React.Fragment>
    ))
  ))}
</tbody>

    </table>
  </div>
  
  
  );
}

export default TablePointage;
