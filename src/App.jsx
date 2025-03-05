import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Gestionnaire from './components/role/Gestionnaire';
import Commercial from './components/role/Commercial';
import ListeEmp from './components/ListeEmp';
import PrivateRoute from './components/PrivateRoute'; 
import { Direction } from './components/role/Direction';
import ListeContratsGestio from './components/contrat/ListeContratsGestio';
import ListeContratsComm from './components/contrat/ListeContratsComm';
import ListeContratsDirec from './components/contrat/ListeContratsDirec';
import Souscription from './components/contrat/Souscription';
import Manager from './components/role/Manager';
import ProfileSetting from './components/ProfileSetting';
import ListeContratsManager from './components/contrat/ListeContratsManager';
import ContratNonValide from './components/contrat/ContratNonValide';
import ContratNvalideGestio from './components/contrat/ContratNvalideGestio';
import Dashboard from './components/Dashboard';
import CommercialsToday from './components/CommercialsToday';
import CommercialChart from './components/CommercialChart';
import AddAgent from './components/AddAgent';
import SouscriptionOPCO from './components/Opco/SouscriptionOPCO';
import ManagerOPCO from './components/Opco/ManagerOPCO';
import CommercialOPCO from './components/Opco/CommercialOPCO';
import ListeRdv from './components/Opco/ListeRdv';
import ListeRdvManager from './components/Opco/ListeRdvManager';
import CommercialVente from './components/Opco/CommercialVente';
import ListeRdvCommVente from './components/Opco/ListeRdvCommVente';
import Formation from './components/Opco/Formation';
import ListeRdvDirection from './components/Opco/ListRdvDirection';
import RdvToday from './components/Opco/RdvToday';
import Devis from './components/contrat/Devis';
import ListeDevisComm from './components/contrat/ListeDevisComm';
import ListeDevisGestio from './components/contrat/ListeDevisGestio';
import ListeDevisDirec from './components/contrat/ListeDevisDirec';
import Agenda from './components/Agenda';
import Prise from './components/role/Prise';
import ListeContratsPrise from './components/contrat/ListeContratsPrise';
import 'react-notifications-component/dist/theme.css';
import TablePointage from './components/TablePointage';
import BlocNotes from './components/BlocNotes';
import ChartComponent from './components/ChartComponent';
import DashChart from './components/DashChart';
import OPCOchart from './components/OPCOchart';
import DashboardGestion from './components/DashbordGestion';
import TableauCommercial from './components/TableauCommercial';
import AddDevis from './components/AddDevis';
import CalendarDevis from './components/CalendarDevis';
import SuperviseurOPCO from './components/Opco/SuperviseurOPCO';
import ListeRdvSuperviseur from './components/Opco/ListeRdvSuperviseur';
import Chat from './components/Chat';
import ManagerEnergie from './components/energie/ManagerEnergie';
import AgentEnergie from './components/energie/AgentEnergie';
import ListeEnergieAgent from './components/energie/ListeEnergieAgent';
import ListeEnergieManager from './components/energie/ListeEnergieManager';
import ListeEnergieDirection from './components/energie/ListeEnergieDirection';
import ChatEnergie from './components/ChatEnergie';
import Calendrier from './components/Calendrier';
import ListeRdvNewComm from './components/Opco/ListeRdvNewComm';
import NewCommVente from './components/Opco/NewCommVente';
import ListeRdvCommVenteOlivier from './components/Opco/ListeRdvCommVenteOlivier';
import CommercialVenteOlivier from './components/Opco/CommercialVenteOlivier';
import FileImport from './components/contrat/FileImport';
import UserPointage from './components/UserPointage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Routes protégées */}
        <Route 
          path="/contratsGest" 
          element={<PrivateRoute element={<ListeContratsGestio/>} allowedRoles={['Gestionnaire']} />} 
        />
        <Route 
          path="/contratsComm" 
          element={<PrivateRoute element={<ListeContratsComm />} allowedRoles={['Commercial']} />} 
        />
        <Route 
          path="/contratsPrise" 
          element={<PrivateRoute element={<ListeContratsPrise />} allowedRoles={['Prise']} />} 
        />
        <Route 
          path="/contratsDire" 
          element={<PrivateRoute element={<ListeContratsDirec />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/contratsManager" 
          element={<PrivateRoute element={<ListeContratsManager />} allowedRoles={['Manager']} />} 
        />
        <Route 
          path="/ajouter-contrat" 
          element={<PrivateRoute element={<Souscription />} allowedRoles={['Gestionnaire', 'Commercial' , 'Direction']} />} 
        />
        <Route 
          path="/ajouter-devis" 
          element={<PrivateRoute element={<Devis />} allowedRoles={['Gestionnaire', 'Commercial' , 'Direction']} />} 
        />
        
        <Route 
          path="/Calendrier" 
          element={<PrivateRoute element={<Calendrier />} allowedRoles={['Gestionnaire', 'Commercial' , 'Direction']} />} 
        />

        <Route 
          path="/Liste-employe" 
          element={<PrivateRoute element={<ListeEmp />} allowedRoles={['Direction']} />} 
        />

 
         
        <Route 
          path="/ajout-employe" 
          element={<PrivateRoute element={<AddAgent />} allowedRoles={['Manager']} />} 
        />
        <Route 
          path="/dashboard" 
          element={<PrivateRoute element={<Dashboard />} allowedRoles={[  'Direction']} />} 
        />
        <Route 
          path="/dashboard-gestion" 
          element={<PrivateRoute element={<DashboardGestion />} allowedRoles={['Gestionnaire', 'Direction']} />} 
        />
        <Route 
          path="/tableau-commercial" 
          element={<PrivateRoute element={<TableauCommercial />} allowedRoles={['Gestionnaire', 'Direction']} />} 
        />
        <Route 
          path="/Prisechart" 
          element={<PrivateRoute element={<DashChart />} allowedRoles={['Gestionnaire', 'Direction']} />} 
        />
        <Route 
          path="/OPCOchart" 
          element={<PrivateRoute element={<OPCOchart />} allowedRoles={[ 'Direction']} />} 
        />
        <Route 
          path="/commToday" 
          element={<PrivateRoute element={<CommercialsToday />} allowedRoles={['Gestionnaire', 'Direction']} />} 
        />
        <Route 
          path="/commClassement" 
          element={<PrivateRoute element={<CommercialChart />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/chart" 
          element={<PrivateRoute element={<ChartComponent />} allowedRoles={[ 'Direction']} />} 
        />
        <Route 
          path="/Agenda" 
          element={<PrivateRoute element={<Agenda />} allowedRoles={['Commercial', 'Direction']} />} 
        />
        <Route 
          path="/Add-Devis" 
          element={<PrivateRoute element={<AddDevis />} allowedRoles={['Commercial', 'Direction']} />} 
        />

         <Route 
          path="/Fichiers" 
          element={<PrivateRoute element={<FileImport />} allowedRoles={['Commercial', 'Direction']} />} 
        />

        <Route 
          path="/calendrier-Devis" 
          element={<PrivateRoute element={<CalendarDevis />} allowedRoles={['Commercial','Direction']} />} 
        />
        <Route 
          path="/chat" 
          element={<PrivateRoute element={<Chat />} allowedRoles={['Commercial','Direction']} />} 
        />
          <Route 
          path="/chat-energie" 
          element={<PrivateRoute element={<ChatEnergie/>} allowedRoles={['ManagerEnergie','AgentEnergie']} />} 
        />
        <Route 
          path="/profile-settings" 
          element={<PrivateRoute element={<ProfileSetting />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/contrats-non-valide" 
          element={<PrivateRoute element={<ContratNonValide />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/contrats-non-valideGestio" 
          element={<PrivateRoute element={<ContratNvalideGestio />} allowedRoles={['Gestionnaire']} />} 
        />
        <Route 
          path="/souscription-OPCO" 
          element={<PrivateRoute element={<SouscriptionOPCO />} allowedRoles={['CommercialeOPCO(A)', 'ManagerOPCO' ,'CommercialeOPCO(B)']} />} 
        />
        <Route 
          path="/liste-RDV" 
          element={<PrivateRoute element={<ListeRdv />} allowedRoles={['CommercialeOPCO' ,'CommercialeOPCO(B)', 'ManagerOPCO']} />} 
        />
        <Route 
          path="/liste-RDV-manager" 
          element={<PrivateRoute element={<ListeRdvManager />} allowedRoles={['ManagerOPCO']} />} 
        />
        <Route 
          path="/liste-RDV-direction" 
          element={<PrivateRoute element={<ListeRdvDirection />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/liste-RDV-commercial" 
          element={<PrivateRoute element={<ListeRdvCommVente />} allowedRoles={['ManagerOPCO' ,'CommercialeVente(A)']} />} 
        />
        <Route 
          path="/liste-RDV-commercial2" 
          element={<PrivateRoute element={<ListeRdvCommVenteOlivier />} allowedRoles={['ManagerOPCO' ,'Commerciale']} />} 
        />
        <Route 
          path="/liste-RDV-superviseur" 
          element={<PrivateRoute element={<ListeRdvSuperviseur />} allowedRoles={['superviseur-OPCO']} />} 
        />
        <Route 
          path="/liste-RDV-OPCO" 
          element={<PrivateRoute element={<ListeRdvNewComm />} allowedRoles={['Direction']} />} 
        />

        <Route 
          path="/CommercialVenteOPCO" 
          element={<PrivateRoute element={<NewCommVente />} allowedRoles={['CommercialeVenteOPCO']} />} 
        />
        <Route 
          path="/formation" 
          element={<PrivateRoute element={<Formation />} allowedRoles={['SouscriptionOPCO']} />} 
        />
        <Route 
          path="/rdv-today" 
          element={<PrivateRoute element={<RdvToday />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/devis-Comm" 
          element={<PrivateRoute element={<ListeDevisComm />} allowedRoles={['Commercial']} />} 
        />
        <Route 
          path="/devis-Gest" 
          element={<PrivateRoute element={<ListeDevisGestio />} allowedRoles={['Gestionnaire']} />} 
        />
        <Route 
          path="/devi-Direction" 
          element={<PrivateRoute element={<ListeDevisDirec />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/pointage" 
          element={<PrivateRoute element={<TablePointage />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/blocNote" 
          element={<PrivateRoute element={<BlocNotes />} allowedRoles={['Direction']} />} 
        />
        {/* Rôles spécifiques */}
        <Route 
          path="/gestionnaire" 
          element={<PrivateRoute element={<Gestionnaire />} allowedRoles={['Gestionnaire']} />} 
        />
        <Route 
          path="/commerciale" 
          element={<PrivateRoute element={<Commercial />} allowedRoles={['Commerciale']} />} 
        />
        <Route 
          path="/Prise" 
          element={<PrivateRoute element={<Prise />} allowedRoles={['Prise']} />} 
        />
        <Route 
          path="/direction" 
          element={<PrivateRoute element={<Direction />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/manager" 
          element={<PrivateRoute element={<Manager />} allowedRoles={['Manager']} />} 
        />
        <Route 
          path="/manager-OPCO" 
          element={<PrivateRoute element={<ManagerOPCO />} allowedRoles={['ManagerOPCO']} />} 
        />
        <Route 
          path="/Commercial-OPCO(A)" 
          element={<PrivateRoute element={<CommercialOPCO />} allowedRoles={['CommercialeOPCO(A)']} />} 
        />
        <Route 
          path="/Commercial-OPCO(B)" 
          element={<PrivateRoute element={<CommercialOPCO />} allowedRoles={['CommercialeOPCO(B)']} />} 
        />
        <Route 
          path="/Commercial-Vente(A)" 
          element={<PrivateRoute element={<CommercialVente />} allowedRoles={['CommercialeVente(A)']} />} 
        />
        <Route 
          path="/Commercial-Vente(B)" 
          element={<PrivateRoute element={<CommercialVenteOlivier />} allowedRoles={['CommercialeVente(B)']} />} 
        />
        <Route 
          path="/superviseur-OPCO" 
          element={<PrivateRoute element={<SuperviseurOPCO />} allowedRoles={['superviseur-OPCO']} />} 
        />
        <Route 
          path="/Manager-energie" 
          element={<PrivateRoute element={<ManagerEnergie />} allowedRoles={['ManagerEnergie']} />} 
        />
        <Route 
          path="/Agent-energie" 
          element={<PrivateRoute element={<AgentEnergie />} allowedRoles={['AgentEnergie']} />} 
        />
        <Route 
          path="/Souscription-energie" 
          element={<PrivateRoute element={<AgentEnergie />} allowedRoles={['ManagerEnergie','AgentEnergie']} />} 
        />
        <Route 
          path="/Liste-RDV-Energie" 
          element={<PrivateRoute element={<ListeEnergieAgent/>} allowedRoles={['ManagerEnergie']} />} 
        />
        <Route 
          path="/Liste-Energie-Manager" 
          element={<PrivateRoute element={<ListeEnergieManager/>} allowedRoles={['ManagerEnergie']} />} 
        />
        <Route 
          path="/Liste-Energie-Direction" 
          element={<PrivateRoute element={<ListeEnergieDirection/>} allowedRoles={['Direction']} />} 
        />
                <Route 
          path="/ponitage" 
          element={<PrivateRoute element={<UserPointage/>} allowedRoles={['Direction']} />} 
        />

       </Routes>
    </Router>
  );
}
export default App;