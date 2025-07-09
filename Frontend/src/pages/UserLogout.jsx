// src/pages/LogoutWrapper.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/services/User";
const UserLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutUser())
      .unwrap()
      .finally(() => {
        navigate("/login");
      });
  }, [dispatch, navigate]);

  return null;
};

export default UserLogout;
