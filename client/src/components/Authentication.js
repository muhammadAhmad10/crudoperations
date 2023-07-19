import "../styles/auth.css";
import { Link } from "react-router-dom";

export default function Authentication({
  title,
  setEmail,
  setPassword,
  secondButton,
  to,
  handleOperation,
  forgotPassword,
  buttonText,
  secondText,
  disableButton,
  errorMessage,
}) {
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className=" contain">
      <div className=" bg-light loginform mb-4" aria-labelledby="tab-login">
        <form className="  mt-1 ">
          <h3 className="mb-4 text-start">{title}</h3>

          <div className="form-outline mb-3">
            <label className="form-label d-flex" htmlFor="loginName">
              Email
            </label>
            <input
              type="email"
              id="loginName"
              onChange={handleEmail}
              className="form-control pt-2 pb-2"
            />
          </div>

          <div className="form-outline mb-3">
            <label className="form-label d-flex" htmlFor="loginPassword">
              Password
            </label>
            <input
              type="password"
              id="loginPassword"
              className="form-control  pt-2 pb-2"
              onChange={handlePassword}
            />
          </div>
          <div
            style={{ fontSize: "12px", marginBottom: "5px", marginLeft: "2px" }}
            className="text-danger"
          >
            {errorMessage}
          </div>

          <div className={`mb-2 d-flex justify-content-end`}>
            {/* <div className="col-md-12 d-flex justify-content-center">
              <div className="form-check mb-3 mb-md-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={true}
                  //   value={checkb}
                  id="loginCheck"
                  onChange={handleCheckBox}
                />
                <label className="form-check-label get" htmlFor="loginCheck">
                  {checkText}
                </label>
              </div>
            </div> */}
            {forgotPassword ? (
              <div className="col-md-6 ">
                <a href="#!" className="links pass">
                  Forgot your password?
                </a>
              </div>
            ) : null}
          </div>
          <div className="d-grid gap-2 mb-4 pb-2 mt-3">
            <button
              className="btn btn-primary"
              type="button"
              disabled={disableButton}
              onClick={handleOperation}
            >
              {buttonText}
            </button>
          </div>

          <div className="text-center mb-4">
            <p className="have">
              {secondText}{" "}
              <Link className="links" to={`/${to}`}>
                {secondButton}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
