import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RdvToday = () => {
  const [rdvCounts, setRdvCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRdvCounts = async () => {
      try {
        const response = await axios.get('/api/rdvs/count-today');
        setRdvCounts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des comptes de RDVs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRdvCounts();
  }, []);

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div>
      <h2>Nombre de RDV par utilisateur aujourd'hui</h2>
      {rdvCounts.length === 0 ? (
        <p>Aucun RDV trouvé pour aujourd'hui.</p>
      ) : (
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap">
          <thead className="bg-blue-gray-500 border-b w-full">
            <tr>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Agent</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nombre de RDV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rdvCounts.map((rdv) => (
              <tr className="hover:bg-gray-50 transition-colors" key={rdv._id}>
                <td  className="px-4 py-3 text-center">{rdv._id ? rdv._id : "Utilisateur inconnu"}</td> {/* Si userName est vide */}
                <td className="px-4 py-3 text-center">{rdv.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RdvToday;
