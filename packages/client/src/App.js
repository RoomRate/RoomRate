import './App.css';
import "../src/scss/custom.scss"
import { PropertyList } from "../src//components/Properties/propertyList"

function App() {
  return (
    <>
      <h1 class="justify-content-center">Welcome to UniHome</h1>
      <div className="App">
        <PropertyList />
      </div>
    </>
  );
}

export default App;
