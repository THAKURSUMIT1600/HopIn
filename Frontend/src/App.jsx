import React, { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { Toaster } from "sonner";
import RootLayout from "./layout/RootLayout";
import { initializeSocket } from "../src/redux/services/Socket";
import UserLogin from "./pages/UserLogin";
import Home from "./pages/Home";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainLogin from "./pages/CaptainLogin";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store/Store";
import UserHome from "./pages/UserHome";
import { Provider } from "react-redux";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import CaptainHome from "./pages/CaptainHome";
import CaptainLogout from "./pages/CaptainLogout";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import CaptainHistory from "./pages/CaptainHistory";
function App() {
  useEffect(() => {
    const socket = initializeSocket();
    socket.emit("hello", "Socket initialized");
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="signup" element={<UserSignup />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/captain-riding" element={<CaptainRiding />} />
        <Route path="/trip-history" element={<CaptainHistory />} />
        <Route path="captain-signup" element={<CaptainSignup />} />
        <Route path="captain-login" element={<CaptainLogin />} />
        <Route
          path="home"
          element={
            <UserProtectWrapper>
              <UserHome />
            </UserProtectWrapper>
          }
        />
        <Route
          path="user/logout"
          element={
            <UserProtectWrapper>
              <UserLogout />
            </UserProtectWrapper>
          }
        />
        <Route
          path="captain-home"
          element={
            <CaptainProtectWrapper>
              <CaptainHome />
            </CaptainProtectWrapper>
          }
        />
        <Route
          path="captain/logout"
          element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          }
        />
      </Route>
    )
  );

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </PersistGate>
    </Provider>
  );
}

export default App;
