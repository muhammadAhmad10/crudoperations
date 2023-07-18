import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import ShowRecipe from "./RoutePages/ShowRecipe";
import AddRecipe from "./RoutePages/AddRecipe";
import EditRecipe from "./RoutePages/EditRecipe";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="body">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<ShowRecipe />} />
            <Route path="/addRecipe" element={<AddRecipe />} />
            <Route path="/editRecipe" element={<EditRecipe />} />

            {/* <Route path="/" element={<Footer />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
