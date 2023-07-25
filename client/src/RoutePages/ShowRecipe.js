import "../styles/showRecipe.css";
import { useNavigate, useLocation, redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import Loader from "./Loader";

export default function ShowRecipe() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [author, setAuthor] = useState(null);
  const [ownerData, setOwnerData] = useState([]);
  const db = JSON.parse(localStorage.getItem("db"));
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [recipeDeleted, setRecipeDeleted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(6);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipe = data.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const currentOwnerRecipe = ownerData.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const totalPages =
    location.pathname === "/myRecipes"
      ? Math.ceil(ownerData.length / recipesPerPage)
      : Math.ceil(data.length / recipesPerPage);

  useEffect(() => {
    setAuthor(JSON.parse(localStorage.getItem("author")));
  }, [location.pathname]);

  useEffect(() => {
    if (!userDataFetched && db && author) {
      var url = "";
      if (db === "mongodb") {
        url = "http://localhost:4000/api/recipes";
      } else {
        url = "http://localhost:8000/api/recipes";
      }
      setLoading(true);
      axios.get(url).then((res) => {
        if (db === "mongodb") {
          setOwnerData(res.data.filter((recipe) => recipe.author === author));
        } else {
          setOwnerData(
            res.data.data.filter((recipe) => recipe.author === author)
          );
        }
        setUserDataFetched(true); // Mark user data as fetched to avoid fetching again
      });
      setLoading(false);
      setRecipeDeleted(false);
    }
  }, [location.pathname, db, userDataFetched, recipeDeleted]);

  useEffect(() => {
    var url = "";
    if (db === "mongodb") {
      url = "http://localhost:4000/api/recipes";
    } else {
      url = "http://localhost:8000/api/recipes";
    }
    if (db) {
      setLoading(true);
      axios.get(url).then((res) => {
        if (db === "mongodb") {
          setData(res.data);
          localStorage.setItem("mongoData", JSON.stringify(res.data));
        } else {
          setData(res.data.data);
          localStorage.setItem("sqliteData", JSON.stringify(res.data.data));
        }
        setLoading(false);
        if (author) {
          if (db === "mongodb") {
            setOwnerData(res.data.filter((recipe) => recipe.author === author));
          } else {
            setOwnerData(
              res.data.data.filter((recipe) => recipe.author === author)
            );
          }
          setUserDataFetched(true);
        }
      });
    }
  }, [db, location.pathname, author, recipeDeleted]);

  const handleDelete = async (id) => {
    console.log(db);
    var url = ``;
    if (db === "mongodb") {
      url += `http://localhost:4000/api/recipes/${id}`;
    } else {
      url += `http://localhost:8000/api/recipes/${id}`;
    }
    setDisableButton(true);
    try {
      const res = axios.delete(url);
      navigate("/myRecipes");
      setDisableButton(false);
      setRecipeDeleted(true);
    } catch {
      console.log("could not delete");
    }
  };

  const handleFavorite = async (id) => {
    console.log("favorite", author, " id: ", id);
    try {
      const response = await axios.post(
        `http://localhost:4000/api/favorites/${author}`,
        { id }
      );
      console.log("added to favorites: ", response.data);
    } catch (error) {
      console.log("error adding to favorites: ", error);
    }
  };

  const RecipeCards = currentRecipe.map((recipe) => {
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
            <div
              style={{ marginTop: "-5px" }}
              className="d-flex  flex-row justify-content-between align-items-center"
            >
              <h6 className="card-subtitle mb-2 text-muted">
                {recipe.category}
              </h6>
              {db === "mongodb" ? (
                <button
                  onClick={() => handleFavorite(recipe._id)}
                  style={{ marginRight: "-15px" }}
                  className="btn btn-secondary pt-1 pb-1"
                >
                  Add Favorite
                </button>
              ) : null}
            </div>

            <Link
              to={`/recipe/${recipe.title}`}
              state={recipe}
              className="card-title fs-4 detail"
            >
              {recipe.title}
            </Link>
            <p className="card-text  author">{recipe.author}</p>
          </div>
        </div>
      </div>
    );
  });

  const RecipeCardsOwner = currentOwnerRecipe.map((recipe) => {
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
            disabled={disableButton}
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-light">Recipes</h1>
          <div className=" recipies d-flex flex-row flex-wrap justify-content-center align-items-center pb-2">
            {author && location.pathname === "/myRecipes"
              ? RecipeCardsOwner
              : RecipeCards}
          </div>
          <div className="pb-3">
            <Pagination className="mt-4 d-flex flex-wrap justify-content-center">
              <Pagination.Prev
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Prev
              </Pagination.Prev>
              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                )
              )}
              <Pagination.Next
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Pagination.Next>
            </Pagination>
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
        </>
      )}
    </div>
  );
}
