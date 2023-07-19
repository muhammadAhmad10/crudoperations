import { useEffect, useState } from "react";
import "../styles/addEditRecipe.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Dropdown } from "react-bootstrap";

export default function EditRecipe() {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state.recipe;
  const db = location.state.db;
  const [updatedRecipe, setUpdatedRecipe] = useState(recipe);

  const [selectedOption, setSelectedOption] = useState(recipe.category);

  const handleOptionChange = (e) => {
    setUpdatedRecipe((prevRecipe) => ({
      ...prevRecipe,
      category: e.target.value,
    }));
    // setSelectedOption(option);
  };

  const handleTitleChange = (e) => {
    setUpdatedRecipe((precRecipe) => ({
      ...precRecipe,
      title: e.target.value,
    }));
  };
  const handleIngredientsChange = (e) => {
    setUpdatedRecipe((recipe) => ({
      ...recipe,
      ingredients: e.target.value,
    }));
  };
  const handleServingsChange = (e) => {
    setUpdatedRecipe((recipe) => ({
      ...recipe,
      servings: e.target.value,
    }));
  };
  const handleInstructionsChange = (e) => {
    setUpdatedRecipe((recipe) => ({
      ...recipe,
      instructions: e.target.value,
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (updatedRecipe) {
      try {
        var url = ``;
        if (db === "mongodb") {
          url += `http://localhost:4000/api/recipes/${updatedRecipe._id}`;
        } else {
          url += `http://localhost:8000/api/recipes/${updatedRecipe._id}`;
        }
        const res = axios.put(url, updatedRecipe);
        navigate("/");
        // console.log("successfully updated: ", res);
      } catch (err) {
        console.log("error occured: ", err);
      }
    }
  };

  return (
    <div className=" formContainer">
      <div className="add-recipe container pt-3 pb-2">
        <form onSubmit={handleEdit}>
          <div className="mb-3 d-flex flex-column ">
            <label htmlFor="title" className="form-label text-start">
              Title
            </label>
            <input
              type="text"
              value={updatedRecipe.title}
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
              value={updatedRecipe.ingredients}
              onChange={handleIngredientsChange}
              className="form-control"
              id="ingredients"
              placeholder="1kg chicken"
            />
          </div>
          <div className="mb-3 d-flex flex-column ">
            <label htmlFor="servings" className="form-label text-start">
              Servings
            </label>
            <input
              type="text"
              value={updatedRecipe.servings}
              onChange={handleServingsChange}
              className="form-control"
              id="servings"
              placeholder="4 servings"
            />
          </div>
          <div className="mb-3 d-flex flex-column ">
            <label htmlFor="category" className="form-label text-start">
              Category
            </label>
            <Dropdown
              style={{
                background: "white",
                color: "black",
                textAlign: "start",
              }}
              onSelect={handleOptionChange}
            >
              <Dropdown.Toggle
                style={{
                  background: "white",
                  color: "black",
                  borderColor: "#bbb9b9",
                }}
                className="btn-lg btn"
                id="dropdown-basic"
              >
                {updatedRecipe.category}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="Appetizers">Appetizers</Dropdown.Item>
                <Dropdown.Item eventKey="Side Dishes">
                  Side Dishes
                </Dropdown.Item>
                <Dropdown.Item eventKey="Desserts">Desserts</Dropdown.Item>
                <Dropdown.Item eventKey="Beverages">Beverages</Dropdown.Item>
                <Dropdown.Item eventKey="Breakfast">Breakfast</Dropdown.Item>
                <Dropdown.Item eventKey="Lunch">Lunch</Dropdown.Item>
                <Dropdown.Item eventKey="Dinner">Dinner</Dropdown.Item>
                <Dropdown.Item eventKey="Salad">Salad</Dropdown.Item>
                <Dropdown.Item eventKey="Snacks">Snacks</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="mb-3 d-flex flex-column ">
            <label htmlFor="instructions" className="form-label text-start">
              Instructions
            </label>
            <textarea
              className="form-control"
              value={updatedRecipe.instructions}
              onChange={handleInstructionsChange}
              id="instructions"
              rows="3"
              placeholder="boil 1 littre water and then add salt in water ...."
            ></textarea>
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              Edit Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
