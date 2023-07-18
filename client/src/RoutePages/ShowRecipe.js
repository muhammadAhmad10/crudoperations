import "../styles/showRecipe.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ShowRecipe() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   axios.get("http://localhost:4000/api/recipes").then((res) => {
  //     setData(res.data);
  //   });
  // }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/api/recipes/${id}`)
      .then((res) => {
        console.log("successfully deleted: ", res);
        setData(data.filter((recipe) => recipe._id !== id));
      })
      .catch((err) => {
        console.log("error occured: ", err);
      });
  };

  const RecipeCards = data.map((recipe) => {
    return (
      <div
        key={recipe._id}
        className="card"
        style={{ width: "18rem", margin: "10px" }}
      >
        <div className="card-body">
          <h5 className="card-title">{recipe.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{recipe.category}</h6>
          <p className="card-text">{recipe.ingredients}</p>

          <button
            className="card-link btn btn-primary"
            onClick={() => {
              navigate("/editRecipe", { state: { recipe } });
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
        {/* {RecipeCards} */}
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
        </div>
      </div>
    </div>
  );
}
