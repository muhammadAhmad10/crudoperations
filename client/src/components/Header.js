import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const author = JSON.parse(localStorage.getItem("author"));

  // useEffect(() => {
  //   setData(JSON.parse(localStorage.getItem("mongoData")));
  //   console.log(data);
  // }, []);

  const handleText = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div style={{ background: "rgb(252, 108, 92)" }}>
      <nav className="navbar">
        <div className="head container-fluid">
          <div className="adm">
            <Link className="nav-link title text-light disabled fs-5" to="/">
              Recipe App
            </Link>
            {author && <p className="text-light">{author}</p>}
          </div>
          <div className="search" id="navbarSupportedContent">
            <form className="d-flex">
              <input
                onChange={handleText}
                className="form-control  me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <Link
                to="/searchedItems"
                state={{ searchText }}
                className="btn btn-outline-primary"
              >
                Search
              </Link>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}
