import { Link } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar({ handleOptionChange }) {
  const handleOptionClick = (option) => {
    handleOptionChange(option);
  };
  const isLogin = JSON.parse(localStorage.getItem("isLogin"));
  return (
    <div className="sidebar">
      <h1 className="text-start text-light m-0  ms-2">MongoDB</h1>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            onClick={() => {
              localStorage.setItem("db", JSON.stringify("mongodb"));

              // setDB("mongodb");
            }}
            className="nav-link text-light"
            aria-current="page"
            to="/"
          >
            Recipes
          </Link>
        </li>
        {isLogin !== null && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                aria-current="page"
                onClick={() => {
                  localStorage.setItem("db", JSON.stringify("mongodb"));

                  // setDB("mongodb");
                }}
                to="/addRecipe"
              >
                Add Recipe
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                aria-current="page"
                onClick={() => {
                  localStorage.setItem("db", JSON.stringify("mongodb"));

                  // setDB("mongodb");
                }}
                to="/myRecipes"
              >
                My Recipes
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                aria-current="page"
                onClick={() => {
                  localStorage.setItem("db", JSON.stringify("mongodb"));

                  // setDB("mongodb");
                }}
                to="/myFavourites"
              >
                Favourite Recipes
              </Link>
            </li>
          </>
        )}
      </ul>
      <hr className="text-light m-0 mt-2 mb-3 ms-2 me-2" />
      <h1 className="text-start text-light m-0 ms-2">SQLite</h1>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            onClick={() => {
              // setDB("sqlite");
              localStorage.setItem("db", JSON.stringify("sqlite"));
            }}
            className="nav-link text-light"
            aria-current="page"
            to="/"
          >
            Recipes
          </Link>
        </li>
        {isLogin !== null && (
          <>
            <li className="nav-item">
              <Link
                onClick={() => {
                  localStorage.setItem("db", JSON.stringify("sqlite"));
                  // setDB("sqlite");
                }}
                className="nav-link text-light"
                aria-current="page"
                to="/addRecipe"
              >
                Add Recipe
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={() => {
                  localStorage.setItem("db", JSON.stringify("sqlite"));

                  // setDB("sqlite");
                }}
                className="nav-link text-light"
                aria-current="page"
                to="/myRecipes"
              >
                My Recipes
              </Link>
            </li>
          </>
        )}
      </ul>
      <hr className="text-light ms-2 me-2 hr" />
      {isLogin === null ? (
        <div className="container">
          <Link
            onClick={() => handleOptionClick("login")}
            className="btn btn-primary ps-5 pe-5 fs-5"
            to="/login"
          >
            Login
          </Link>
        </div>
      ) : (
        <div className="container">
          <Link
            onClick={() => handleOptionClick("logout")}
            className="btn btn-primary ps-5 pe-5 fs-5"
            to="/"
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}
