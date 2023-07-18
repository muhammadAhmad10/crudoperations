import { Link } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar({ setDB, setUserType }) {
  return (
    <div className="sidebar">
      <h1 className="text-start text-light ms-2">MongoDB</h1>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link text-light" aria-current="page" to="/">
            Recipes
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link text-light"
            aria-current="page"
            to="/addRecipe"
          >
            Add Recipe
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link text-light"
            aria-current="page"
            to="/myRecipes"
          >
            My Recipes
          </Link>
        </li>
      </ul>
      <hr className="text-light ms-2 me-2" />
      <h1 className="text-start text-light ms-2">SQLite</h1>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link text-light" aria-current="page" to="/">
            Recipes
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link text-light"
            aria-current="page"
            to="/addRecipe"
          >
            Add Recipe
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link text-light"
            aria-current="page"
            to="/myRecipes"
          >
            My Recipes
          </Link>
        </li>
      </ul>
    </div>
  );
}
