import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/RecipeDetails.css";
export default function RecipeDetail() {
  const { state } = useLocation();
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const ingredients = state.ingredients.split(",");
    setIngredients(ingredients);
  }, []);

  return (
    <div
      style={{
        overflowY: "scroll",
        height: "91vh",
        paddingTop: "30px",
        paddingBottom: "30px",
      }}
      className="container"
    >
      <h1 className="text-light">{state.title}</h1>

      <div className="img">
        {state.image ? (
          <img
            src={state.image}
            alt="details of recipe"
            // style={{ width: "400px", height: "200px" }}
          />
        ) : (
          <img
            src={process.env.PUBLIC_URL + "/defaultRecipe.jpg"}
            alt="details of recipe"
            // style={{ width: "100%", height: "300px" }}
          />
        )}
      </div>
      <p className="text-light">{state.category}</p>

      <div className="text text-light text-start">
        <h2>Ingredients</h2>
        <ul>
          {ingredients &&
            ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
        </ul>
        <h2>Servings</h2>
        <p style={{ marginLeft: "35px" }}>{state.servings}</p>
        <h2>Instructions</h2>

        <p style={{ marginLeft: "30px" }}>{state.instructions}</p>
      </div>
    </div>
  );
}
