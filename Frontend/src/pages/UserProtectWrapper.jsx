import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUserProfile } from "../redux/services/User";

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      dispatch(loadUserProfile())
        .unwrap()
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [navigate, dispatch]);

  return <>{children}</>;
};

export default UserProtectWrapper;
