import { useEffect, useState } from "react";
import "../styles/addEditRecipe.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfTkAdt5GHgXS6hE8YBphkbs4rfoPibdM",
  authDomain: "web-dev-acccd.firebaseapp.com",
  projectId: "web-dev-acccd",
  storageBucket: "web-dev-acccd.appspot.com",
  messagingSenderId: "682830567134",
  appId: "1:682830567134:web:e9e897c99424447eeb144f",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();
const storageRef = storage.ref();

export default function AddRecipe() {
  const author = JSON.parse(localStorage.getItem("author"));
  const db = JSON.parse(localStorage.getItem("db"));
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: "",
    image: "",
    category: "",
    author: author,
  });
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("Appetizers");
  const [image, setImage] = useState(null);
  const [downloadUrl, setDownloadURL] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  useEffect(() => {
    if (image) {
      const uploadTask = storageRef.child(`recipes/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        // (snapshot) => {
        //   // Progress monitoring (optional)
        //   const progress =
        //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //   console.log("Upload is " + progress + "% done");
        // },
        (error) => {
          // Error handling
          console.log(error);
        },
        async () => {
          // Upload success
          await uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // console.log("File available at", downloadURL);
            setRecipe((recip) => ({
              ...recip,
              image: downloadURL,
            }));
            setDownloadURL(downloadURL);
          });
        }
      );
    }
  }, [image]);

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
    // console.log("db is: ", db);
    e.preventDefault();
    // console.log(recipe);
    if (recipe && downloadUrl) {
      var url = "";
      if (db === "mongodb") {
        url += "http://localhost:4000/api/recipes";
      } else {
        url += "http://localhost:8000/api/recipes";
      }
      if (db === "sqlite") {
        try {
          axios.post(url, recipe);
          // console.log("data uploaded successfuly");
          navigate("/myRecipes");
        } catch {
          alert("Error while uploading data");
        }
      }

      if (db === "mongodb") {
        await axios
          .post(url, recipe)
          .then((res) => {
            // console.log("data inserted successfully", res);
            navigate("/myRecipes");
          })
          .catch((err) => {
            console.log("error occured: ", err);
          });
      }
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

          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              Add Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
