import './App.css';
import "../src/scss/custom.scss"
import { RoutesComponent } from './app/routes.component';

function App() {
  return (
    <>
      <h1 className="justify-content-center">Welcome to UniHome</h1>
      <div className="App">
        <RoutesComponent />
      </div>
    </>
  );
}

export default App;
