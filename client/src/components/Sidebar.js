import { Link } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
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
      </ul>
    </div>
  );
}
