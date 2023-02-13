import './App.css';
import "../src/scss/custom.scss";
import { RoutesComponent } from './app/routes.component';
import { Navigation } from './components/Panels/Navigation/navbar';
import { AuthProvider } from 'shared/contexts/AuthContext';

function App() {
  return (
    <>
      <div className="App">
        <AuthProvider>
          <Navigation />
          <RoutesComponent />
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
