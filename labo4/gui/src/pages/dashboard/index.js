import axios from 'axios';
import Cookies from 'js-cookie';


// Récupérez le token JWT stocké
const token = Cookies.get('jwt');

// Configurez Axios pour inclure le token dans chaque requête
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const DashboardDefault = () => {

  return (
    <div>
      en cours....
   </div>
  );
};

export default DashboardDefault;
