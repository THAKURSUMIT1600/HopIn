import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadCaptainProfile } from "../redux/services/Captain";

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/captain-login");
    } else {
      dispatch(loadCaptainProfile())
        .unwrap()
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/captain-login");
        });
    }
  }, [dispatch, navigate]);

  return <>{children}</>;
};

export default CaptainProtectWrapper;
