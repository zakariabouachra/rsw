// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import 'chart.js/auto';


// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
