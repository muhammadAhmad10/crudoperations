import React from "react";
import { SyncLoader } from "react-spinners";

const Loader = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SyncLoader color="#2b224a" size={30} />
    </div>
  );
};

export default Loader;
