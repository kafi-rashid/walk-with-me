import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Product from "../pages/Product";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const AuthRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={ <Home/> }/>
            <Route path="/products" element={ <Products/> }/>
            <Route path="/products/:id" element={ <Product/> }/>
        </Routes>
    );
};

export const PublicRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={ <Login/> }/>
            <Route path="/register" element={ <Register/> }/>
        </Routes>
    );
};
  