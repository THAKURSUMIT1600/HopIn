// src/pages/LogoutWrapper.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutCaptain } from "../redux/services/Captain";
const CaptainLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutCaptain())
      .unwrap()
      .finally(() => {
        navigate("/captain-login");
      });
  }, [dispatch, navigate]);

  return null;
};

export default CaptainLogout;
