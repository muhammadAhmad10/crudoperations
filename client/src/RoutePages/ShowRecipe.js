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
  const [added, setAdded] = useState(false);
  const [favoriteButtonText, setFavoriteButtonText] = useState("Add Favorite");
  const [favorites, setFavorites] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [recipesPerPage] = useState(6);

  // const indexOfLastRecipe = currentPage * recipesPerPage;
  // const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  // const currentRecipe = data.slice(indexOfFirstRecipe, indexOfLastRecipe);
  // const currentOwnerRecipe = ownerData.slice(
  //   indexOfFirstRecipe,
  //   indexOfLastRecipe
  // );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  // useEffect(() => {
  //   fetchData();
  // }, [currentPage]);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:4000/api/recipes?page=${currentPage}&limit=${recipesPerPage}`
  //     );
  //     console.log("data from paginated mongo request: ", response.data.data);
  //     setData(response.data.data);
  //     setTotalPages(response.data.totalPages);
  //   } catch (error) {
  //     console.log("Error fetching data:", error);
  //   }
  // };

  // const totalPages =
  //   location.pathname === "/myRecipes"
  //     ? Math.ceil(ownerData.length / recipesPerPage)
  //     : Math.ceil(data.length / recipesPerPage);

  useEffect(() => {
    setAuthor(JSON.parse(localStorage.getItem("author")));
    setTotalPages(0);
  }, [location.pathname]);

  useEffect(() => {
    setAdded(JSON.parse(localStorage.getItem("edited")));
  }, []);

  useEffect(() => {
    // setTotalPages(0);
    console.log("first useEffect to fetch data.", added);
    console.log(db, author, location.pathname || added);
    const getData = async () => {
      if (db && author && location.pathname === "/myRecipes") {
        var url = "";
        if (db === "mongodb") {
          url = `http://localhost:4000/api/recipes/${author}?page=${currentPage}&limit=${recipesPerPage}`;
        } else {
          url = `http://localhost:8000/api/recipes/${author}?page=${currentPage}&limit=${recipesPerPage}`;
        }
        setLoading(true);
        console.log(url);
        await axios.get(url).then((res) => {
          if (db === "mongodb") {
            console.log(
              "data is: ",
              db,
              res.data.data,
              "and added is: ",
              added
            );
            setOwnerData(
              res.data.data.filter((recipe) => recipe.author === author)
            );
            setTotalPages(res.data.totalPages);
          } else {
            setOwnerData(
              res.data.data.filter((recipe) => recipe.author === author)
            );
            setTotalPages(res.data.totalPages);
          }
          setUserDataFetched(true); // Mark user data as fetched to avoid fetching again
        });
        setLoading(false);
        setRecipeDeleted(false);
        localStorage.setItem("edited", JSON.stringify(false));
      }
    };
    getData();
  }, [recipeDeleted, currentPage, location.pathname, db, author, added]);
  //location.pathname, db, userDataFetched,

  useEffect(() => {
    console.log("second useEffect to fetch data.");

    var url = "";
    if (db === "mongodb") {
      url = `http://localhost:4000/api/recipes?page=${currentPage}&limit=${recipesPerPage}`;
    } else {
      url = `http://localhost:8000/api/recipes?page=${currentPage}&limit=${recipesPerPage}`;
    }
    if (db && location.pathname === "/") {
      setLoading(true);
      axios.get(url).then((response) => {
        if (db === "mongodb") {
          console.log(
            "data from paginated mongo request: ",
            response.data.data
          );
          setData(response.data.data);
          setTotalPages(response.data.totalPages);
          localStorage.setItem("mongoData", JSON.stringify(response.data.data));
        } else {
          console.log(
            "data from paginated sqlite request: ",
            response.data.data
          );

          setData(response.data.data);
          setTotalPages(response.data.totalPages);
          localStorage.setItem(
            "sqliteData",
            JSON.stringify(response.data.data)
          );
        }
        setLoading(false);
        // if (author) {
        //   if (db === "mongodb") {
        //     setOwnerData(
        //       response.data.data.filter((recipe) => recipe.author === author)
        //     );
        //   } else {
        //     setOwnerData(
        //       response.data.data.filter((recipe) => recipe.author === author)
        //     );
        //   }
        //   setUserDataFetched(true);
        // }
      });
    }
  }, [db, location.pathname, author, recipeDeleted, currentPage, added]);

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

  //Handling the favorites part
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      console.log("fetching favorites list", author);
      if (author) {
        const res = await axios.get(
          `http://localhost:4000/api/favorites/${author}`
        );

        const responseData = await res.data.data.recipes;
        console.log("response data is: ", responseData);
        setFavorites(responseData);
        setLoading(false);
      }
    };
    fetchData();
  }, [favoriteButtonText, location.pathname, author]);

  const handleFavorite = async (id) => {
    const favs = favorites.filter((fav) => {
      return !fav["_id"] !== String(id);
    });
    setDisableButton(true);
    if (!favs) {
      try {
        const response = await axios.post(
          `http://localhost:4000/api/favorites/${author}`,
          { id }
        );
        setDisableButton(false);
        setFavoriteButtonText("Remove");
        console.log("added to favorites: ", response.data);
      } catch (error) {
        console.log("error adding to favorites: ", error);
      }
    } else {
      //remove from favorite list
      setDisableButton(true);

      try {
        const res = await axios.delete(
          `http://localhost:4000/api/favorites/${author}`,
          { data: { recipeId: id } }
        );
        setDisableButton(false);
        setFavoriteButtonText("Add Favorite");
        console.log("recipe removed from favorite: ", res);
      } catch (e) {
        console.log("could not remove recipe from favorite: ", e);
      }
    }
  };

  const RecipeCards = data.map((recipe) => {
    const isFavorite = favorites.some((fav) => fav._id === recipe._id);

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
                  {isFavorite ? "Remove" : "Add Favorite"}
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
            {/* {RecipeCards} */}
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
          </div>
        </>
      )}
    </div>
  );
}
