import { Link } from "react-router-dom";
import "../styles/header.css";
export default function Header() {
  return (
    <div style={{ background: "rgb(252, 108, 92)" }}>
      <nav className="navbar">
        <div className="head container-fluid">
          <Link className="nav-link title text-light disabled fs-5" to="/">
            Recipe App
          </Link>

          <div className="search" id="navbarSupportedContent">
            <form className="d-flex">
              <input
                className="form-control  me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-primary" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}
