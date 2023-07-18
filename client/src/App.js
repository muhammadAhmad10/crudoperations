import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import ShowRecipe from "./RoutePages/ShowRecipe";
import AddRecipe from "./RoutePages/AddRecipe";
import EditRecipe from "./RoutePages/EditRecipe";
import { useState, useEffect } from "react";

function App() {
  const [db, setDB] = useState("mongodb");
  const [usertype, setUserType] = useState("guest");

  return (
    <div className="App">
      <Header />
      <div className="main">
        <div className="sidebar">
          <Sidebar setDB={setDB} setUserType={setUserType} />
        </div>
        <div className="body">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<ShowRecipe />} />
            <Route path="/addRecipe" element={<AddRecipe />} />
            <Route path="/editRecipe" element={<EditRecipe />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
