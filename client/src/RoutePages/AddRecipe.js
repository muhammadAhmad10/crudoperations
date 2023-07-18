import { useState } from "react";
import "../styles/addEditRecipe.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddRecipe() {
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: "",
    servings: "",
    instructions: "",
    category: "drinks",
  });
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setRecipe((precRecipe) => ({
      ...precRecipe,
      title: e.target.value,
    }));
  };
  const handleIngredientsChange = (e) => {
    setRecipe((recipe) => ({
      ...recipe,
      ingredients: e.target.value,
    }));
  };
  const handleServingsChange = (e) => {
    setRecipe((recipe) => ({
      ...recipe,
      servings: e.target.value,
    }));
  };
  const handleInstructionsChange = (e) => {
    setRecipe((recipe) => ({
      ...recipe,
      instructions: e.target.value,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (recipe) {
      await axios
        .post("http://localhost:4000/api/recipes", recipe)
        .then((res) => {
          navigate("/");
          console.log("successfully added: ", res);
        })
        .catch((err) => {
          console.log("error occured: ", err);
        });
    }
  };
  return (
    <div className="add-recipe container pt-3 pb-2">
      <form method="post" onSubmit={handleAdd}>
        <div className="mb-3 d-flex flex-column ">
          <label htmlFor="title" className="form-label text-start">
            Title
          </label>
          <input
            type="text"
            onChange={handleTitleChange}
            className="form-control"
            id="title"
            placeholder="Chicken biryani"
          />
        </div>
        <div className="mb-3 d-flex flex-column ">
          <label htmlFor="ingredients" className="form-label text-start">
            Ingredients
          </label>
          <input
            type="text"
            onChange={handleIngredientsChange}
            className="form-control"
            id="ingredients"
            placeholder="1kg chicken, 2 tbs salt, ..."
          />
        </div>
        <div className="mb-3 d-flex flex-column ">
          <label htmlFor="servings" className="form-label text-start">
            Servings
          </label>
          <input
            type="text"
            onChange={handleServingsChange}
            className="form-control"
            id="servings"
            placeholder="4 servings"
          />
        </div>
        <div className="mb-3 d-flex flex-column ">
          <label htmlFor="instructions" className="form-label text-start">
            Instructions
          </label>
          <textarea
            className="form-control"
            onChange={handleInstructionsChange}
            id="instructions"
            rows="3"
            placeholder="boil 1 littre water and then add salt in water ...."
          ></textarea>
        </div>
        <div className="mb-3 d-flex flex-column ">
          <label htmlFor="image" className="form-label text-start">
            Image
          </label>
          <input className="form-control" id="image" type="file" />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Add Recipe
          </button>
        </div>
      </form>
    </div>
  );
}
