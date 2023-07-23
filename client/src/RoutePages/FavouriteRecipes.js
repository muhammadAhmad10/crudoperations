import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import axios from "axios";

export default function FavouriteRecipes() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(4);
  const location = useLocation();
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    setAuthor(JSON.parse(localStorage.getItem("author")));
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      if (author) {
        const res = await axios.get(
          `http://localhost:4000/api/favorites/${author}`
        );
        const responseData = await res.data.recipes;
        setData(responseData);
      }
    };
    fetchData();
  }, [author, location.pathname]);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipe = data.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const totalPages = Math.ceil(data.length / recipesPerPage);

  const handleRemoveFavorite = async (id) => {
    if (author) {
      try {
        const res = await axios.delete(
          `http://localhost:4000/api/favorites/${author}`,
          { data: { recipeId: id } }
        );
        setData((prevData) => prevData.filter((recipe) => recipe._id !== id));

        console.log("recipe removed from favorite: ", res);
      } catch (e) {
        console.log("could not remove recipe from favorite: ", e);
      }
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
              <button
                onClick={() => handleRemoveFavorite(recipe._id)}
                style={{ marginRight: "-15px" }}
                className="btn btn-secondary pt-1 pb-1"
              >
                Remove Favorite
              </button>
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

  return (
    <div className="showRecipe">
      <h1 className="text-light">Recipes</h1>
      <div className=" recipies d-flex flex-row flex-wrap justify-content-center align-items-center pb-2">
        {RecipeCards}
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
    </div>
  );
}
