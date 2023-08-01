import { useEffect, useState } from "react";
import "../styles/addEditRecipe.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import Swal from "sweetalert2";

export default function AddRecipe() {
  const author = JSON.parse(localStorage.getItem("author"));
  const db = JSON.parse(localStorage.getItem("db"));
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("Appetizers");
  const [disableButton, setDisableButton] = useState(false);

  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: "",
    category: selectedOption,
    author: author,
    image: null,
  });
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    color: "white",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "tiff",
      "psd",
      "raw",
    ];
    const uploadedFileExtension = file.name.split(".")[1];
    console.log(file);
    const uploadedFileSize = file.size;
    console.log(uploadedFileSize);
    const isImage = imageExtensions.includes(uploadedFileExtension);
    if (isImage && uploadedFileSize <= 512000) {
      setRecipe({
        ...recipe,
        image: file,
      });
    } else {
      if (isImage && uploadedFileSize >= 512000) {
        await Toast.fire({
          icon: "error",
          title: "Error",
          text: "Image size can be maximum 500KB!",
          background: "#f27474",
        });
      } else {
        await Toast.fire({
          icon: "error",
          title: "Error",
          text: "You are allowed to upload image only!",
          background: "#f27474",
        });
      }
    }
  };

  const handleOptionChange = async (e) => {
    setSelectedOption(e);
    setRecipe((precRecipe) => ({
      ...precRecipe,
      category: e,
    }));
  };

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

    const missingFields = [];

    if (!recipe.title) {
      missingFields.push("Title");
    }

    if (!recipe.ingredients) {
      missingFields.push("Ingredients");
    }

    if (!recipe.author) {
      missingFields.push("Author");
    }

    if (!recipe.category) {
      missingFields.push("Category");
    }

    if (!recipe.instructions) {
      missingFields.push("Instructions");
    }

    if (!recipe.servings) {
      missingFields.push("Servings");
    }

    if (!recipe.image) {
      missingFields.push("Image");
    }

    if (missingFields.length === 0) {
      setDisableButton(true);
      var url = "";
      if (db === "mongodb") {
        url += "http://localhost:4000/api/recipes";
      } else {
        url += "http://localhost:8000/api/recipes";
      }
      if (db) {
        try {
          const response = await axios.post(url, recipe, {
            headers: {
              "Content-Type": "multipart/form-data", // Set the correct content type for form data
            },
          });
          console.log("response to post request is: ", response);
          if (response.status === 200) {
            localStorage.setItem("edited", JSON.stringify(true));
            localStorage.setItem("refresh", JSON.stringify(true));
            Toast.fire({
              icon: "success",
              title: "Success",
              background: "#a5dc86",
            });
            setTimeout(() => {
              setDisableButton(false);
              navigate("/myRecipes", { state: recipe });
            }, 2000);
          }
        } catch (error) {
          setDisableButton(false);
          console.log("error while posting the recipe: ", error);
          console.log("erorr occured is: ", error.response);
          Toast.fire({
            icon: "error",
            title: "Error",
            text: error.message + ". Message: " + error.response.data,
            background: "#f27474",
          });
        }
      }
    } else {
      await Toast.fire({
        icon: "error",
        title: "Error",
        text: `Please enter the following fields: ${missingFields.join(", ")}`,
        background: "#f27474",
      });
    }
  };

  return (
    <div className=" formContainer">
      <div className="add-recipe container pt-3 pb-2">
        <form method="post" onSubmit={handleAdd} encType="multipart/form-data">
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
            <label htmlFor="image" className="form-label text-start">
              Image
            </label>
            <input
              className="form-control"
              name="image"
              id="image"
              type="file"
              onChange={handleImageChange}
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
                {selectedOption}
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
              onChange={handleInstructionsChange}
              id="instructions"
              rows="3"
              placeholder="boil 1 littre water and then add salt in water ...."
            ></textarea>
          </div>
          <p
            style={{
              fontSize: "13px",
              textAlign: "start",
              color: "red",
              marginBottom: "10px",
            }}
          >
            {errorMessage}
          </p>
          <div className="mb-3">
            <button
              disabled={disableButton}
              type="submit"
              className="btn btn-primary"
            >
              Add Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
