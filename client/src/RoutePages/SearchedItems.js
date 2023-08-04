import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function SearchedItems() {
  const [data, setData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchText = location.state.searchText;
  const [loading, setLoading] = useState(false);

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

  // useEffect(() => {
  //   if (searchText) {
  //     axios
  //       .get(`http://localhost:4000/api/recipes/search/${searchText}`)
  //       .then((res) => {
  //         setData(res.data);
  //       })
  //       .catch((err) => {
  //         console.log("Error searching data: ", err);
  //       });
  //   }
  // }, [searchText]);

  useEffect(() => {
    // Set loading to true before getting data
    const getData = async () => {
      setLoading(true);
      if (loading && data.length === 0) {
        console.log("going to make an api call");
        try {
          const res = await axios.get(
            `http://localhost:4000/api/recipes/search/${searchText}`
          );
          setData(res.data);
          setLoading(false); // Set loading to false after data is fetched
        } catch (err) {
          await Toast.fire({
            icon: "error",
            title: "Error",
            text: err.response.data,
            background: "#f27474",
          });
          navigate("/");
          // console.log("Error searching data: ", err);
        }
      }
    };
    getData();
  }, [searchText, loading, data]); // Include data as a dependency

  useEffect(() => {
    if (searchText) {
      setData([]);
    }
  }, [searchText]);

  const RecipeCards = data.map((recipe, index) => {
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
    </div>
  );
}
