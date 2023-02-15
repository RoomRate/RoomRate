import './App.css';
import "../src/scss/custom.scss";
import { RoutesComponent } from './app/routes.component';
import { Navigation } from './components/Panels/Navigation/navbar';
import { Providers } from './app/provider.component';

function App() {
  return (
    <div className="App">
      <Providers>
        <Navigation />
        <RoutesComponent />
      </Providers>
    </div>
  );
}

export default App;
