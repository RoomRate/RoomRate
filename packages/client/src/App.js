import './App.css';
import "../src/scss/custom.scss";
import { RoutesComponent } from './app/routes.component';
import { Navigation } from './components/Panels/Navigation/navbar';

function App() {
  return (
    <>
      <div className="App">
        <Navigation />
        <RoutesComponent />
      </div>
    </>
  );
}

export default App;
