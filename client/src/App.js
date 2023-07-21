import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useNavigate, Route, useLocation, Routes } from "react-router-dom";
import ShowRecipe from "./RoutePages/ShowRecipe";
import AddRecipe from "./RoutePages/AddRecipe";
import EditRecipe from "./RoutePages/EditRecipe";
import { useState, useEffect } from "react";
import Authentication from "./components/Authentication";
import RecipeDetail from "./RoutePages/RecipeDetail";
import "firebase/app";
import "firebase/compat/app";
import app from "./config";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

function App() {
  // const [db, setDB] = useState("mongodb");
  // const [usertype, setUserType] = useState("guest");

  let navigate = useNavigate();
  let location = useLocation();

  const [selectedOption, setSelectedOption] = useState("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const isLogin = JSON.parse(localStorage.getItem("isLogin"));
  // const author = JSON.parse(localStorage.getItem("author"));
  const [disableButton, setDisableButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [to, setTo] = useState("");

  const handleOperation = async (type) => {
    setErrorMessage(" ");
    setDisableButton(true);
    const auth = getAuth();
    if (email !== "" && password !== "") {
      if (type === "register") {
        await createUserWithEmailAndPassword(auth, email, password)
          .then((res) => {
            localStorage.setItem("isLogin", JSON.stringify("login"));
            localStorage.setItem("author", JSON.stringify(email));
            setDisableButton(false);
            navigate("/");
            // console.log("user registered successfully!");
          })
          .catch(() => {
            setErrorMessage(
              "User already exist, please try different credentials."
            );
            setDisableButton(false);
          });
      } else if (type === "login") {
        await signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            localStorage.setItem("isLogin", JSON.stringify("login"));
            localStorage.setItem("author", JSON.stringify(email));
            setDisableButton(false);

            navigate("/");
            // console.log("user login successfully!");
          })
          .catch(() => {
            setErrorMessage(`Incorrect email or password.`);
            setDisableButton(false);
          });
      }
    } else {
      setErrorMessage("Please fill all the fields");
      setDisableButton(false);
    }
    // console.log("button clicked is: ", id);
  };

  useEffect(() => {
    setTo(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    setErrorMessage(" ");
  }, [to]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    // console.log("logout button pressed", selectedOption);
    if (selectedOption === "logout") {
      localStorage.setItem("isLogin", JSON.stringify(null));
      localStorage.setItem("author", JSON.stringify("null"));
      localStorage.setItem("db", JSON.stringify("mongodb"));
      navigate("/");
    }
  }, [selectedOption]);
  // console.log(db);
  return (
    <div className="App">
      <Header />
      <div className="main">
        <div className="sidebar">
          <Sidebar handleOptionChange={handleOptionChange} />

          {/* <Sidebar setDB={setDB} handleOptionChange={handleOptionChange} /> */}
        </div>
        <div className="body">
          <Routes>
            <Route path="/" element={<ShowRecipe />} />
            <Route path="/myRecipes" element={<ShowRecipe />} />
            <Route path="/recipe/:title" element={<RecipeDetail />} />
            <Route path="/addRecipe" element={<AddRecipe />} />
            <Route path="/editRecipe" element={<EditRecipe />} />
            <Route
              path="/login"
              element={
                <Authentication
                  title="Sign in to your account"
                  secondButton="Register"
                  to="register"
                  setEmail={setEmail}
                  setPassword={setPassword}
                  handleOperation={() => handleOperation("login")}
                  forgotPassword={true}
                  buttonText="Sign in"
                  secondText="Not a member?"
                  disableButton={disableButton}
                  errorMessage={errorMessage}
                />
              }
            />
            <Route
              path="/register"
              element={
                <Authentication
                  title="Create your account"
                  secondButton="Sign in"
                  to="login"
                  setEmail={setEmail}
                  setPassword={setPassword}
                  handleOperation={() => handleOperation("register")}
                  forgotPassword={false}
                  buttonText="Create account"
                  secondText="Have an accound?"
                  disableButton={disableButton}
                  errorMessage={errorMessage}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
