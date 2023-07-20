import "../styles/showRecipe.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ShowRecipe() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  // const [isLogin, setIsLogin] = useState(null);
  const [author, setAuthor] = useState(null);
  const [ownerData, setOwnerData] = useState([]);
  const db = JSON.parse(localStorage.getItem("db"));

  // console.log(isLogin, author);
  useEffect(() => {
    setAuthor(JSON.parse(localStorage.getItem("author")));
    // setIsLogin(JSON.parse(localStorage.getItem("isLogin")));

    // setOwnerData(data.filter((recipe) => recipe.author === author));
  }, [location.pathname]);

  useEffect(() => {
    var url = "";
    if (db === "mongodb") {
      url = "http://localhost:4000/api/recipes";
    } else {
      url = "http://localhost:8000/api/recipes";
    }
    if (db) {
      axios.get(url).then((res) => {
        if (db === "mongodb") {
          // setData(res.data);
          setOwnerData(res.data.filter((recipe) => recipe.author === author));
        } else {
          // setData(res.data.data);
          setOwnerData(
            res.data.data.filter((recipe) => recipe.author === author)
          );
        }
      });
    }
  }, [location.pathname, db, ownerData]);

  useEffect(() => {
    var url = "";
    if (db === "mongodb") {
      url = "http://localhost:4000/api/recipes";
    } else {
      url = "http://localhost:8000/api/recipes";
    }
    if (db) {
      axios.get(url).then((res) => {
        if (db === "mongodb") {
          setData(res.data);
        } else {
          setData(res.data.data);
        }
      });
    }
  }, [db, location.pathname]);

  const handleDelete = (id) => {
    console.log(db);
    var url = ``;
    if (db === "mongodb") {
      url += `http://localhost:4000/api/recipes/${id}`;
    } else {
      url += `http://localhost:8000/api/recipes/${id}`;
    }
    axios
      .delete(url)
      .then((res) => {
        console.log("successfully deleted: ", res);
        setData(data.filter((recipe) => recipe._id !== id));
        navigate("/myRecipes");
      })
      .catch((err) => {
        console.log("error occured: ", err);
      })
      .finally(() => {
        navigate("/myRecipes");
      });
  };

  const RecipeCards = data.map((recipe) => {
    return (
      <div
        key={recipe._id}
        className="card"
        style={{ width: "18rem", margin: "10px" }}
      >
        {recipe.image ? (
          <img src={recipe.image} className="card-img-top" alt="recipe" />
        ) : (
          <img
            src={process.env.PUBLIC_URL + "/defaultRecipe.jpg"}
            className="card-img-top"
            alt="recipe"
          />
        )}

        <div className="card-body">
          <div className="pb-3 container-fluid text-start ">
            <h6 className="card-subtitle mb-2 text-muted">{recipe.category}</h6>

            <Link
              to={`/recipe/${recipe.title}`}
              state={recipe}
              className="card-title fs-4 detail"
            >
              {recipe.title}
            </Link>
            <p className="card-text  author">{recipe.author}</p>
          </div>
          {/* <button
            className="card-link btn btn-primary"
            onClick={() => {
              navigate("/editRecipe", { state: { recipe, db } });
            }}
          >
            Edit Recipe
          </button>
          <button
            className="card-link btn btn-danger"
            onClick={() => handleDelete(recipe._id)}
          >
            Delete Recipe
          </button> */}
        </div>
      </div>
    );
  });

  const RecipeCardsOwner = ownerData.map((recipe) => {
    return (
      <div
        key={recipe._id}
        className="card"
        style={{ width: "18rem", margin: "10px" }}
      >
        {recipe.image ? (
          <img src={recipe.image} className="card-img-top" alt="recipe" />
        ) : (
          <img
            src={process.env.PUBLIC_URL + "/defaultRecipe.jpg"}
            className="card-img-top"
            alt="recipe"
          />
        )}

        <div className="card-body">
          <div className="pb-3 container-fluid text-start ">
            <h6 className="card-subtitle mb-2 text-muted">{recipe.category}</h6>

            <Link
              to={`/recipe/${recipe.title}`}
              state={recipe}
              className="card-title fs-4 detail"
            >
              {recipe.title}
            </Link>
            {/* <p className="card-text  author">{recipe.author}</p> */}
          </div>
          <button
            className="card-link btn btn-primary"
            onClick={() => {
              navigate("/editRecipe", { state: { recipe, db } });
            }}
          >
            Edit Recipe
          </button>
          <button
            className="card-link btn btn-danger"
            onClick={() => handleDelete(recipe._id)}
          >
            Delete Recipe
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="showRecipe">
      <h1 className="text-light">Recipes</h1>
      <div className=" recipies d-flex flex-row flex-wrap justify-content-center align-items-center pb-4">
        {author && location.pathname === "/myRecipes"
          ? RecipeCardsOwner
          : RecipeCards}
        {/* <div className="card" style={{ width: "18rem", margin: "10px" }}>
          <div className="card-body">
            <h5 className="card-title">Recipie title</h5>
            <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <Link to="/editRecipe" className="card-link btn btn-primary">
              Edit Recipe
            </Link>
            <a href="#" className="card-link btn btn-danger">
              Delete Recipe
            </a>
          </div>
        </div>
        <div className="card" style={{ width: "18rem", margin: "10px" }}>
          <div className="card-body">
            <h5 className="card-title">Recipie title</h5>
            <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <Link to="/editRecipe" className="card-link btn btn-primary">
              Edit Recipe
            </Link>
            <a href="#" className="card-link btn btn-danger">
              Delete Recipe
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
