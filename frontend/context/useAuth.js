// src/context/useAuth.js
import { useContext } from "react";
import { AuthContext } from "./authContext.jsx";

export const useAuth = () => useContext(AuthContext);
