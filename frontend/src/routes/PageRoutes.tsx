import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Product from "../pages/Product";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminHome from "../pages/Admin/Home";
import Sellers from "../pages/Admin/Sellers";
import Reviews from "../pages/Admin/Reviews";
import SellerHome from "../pages/Seller/Home";
import Products from "../pages/Seller/Products";
import Orders from "../pages/Seller/Orders";
import Categories from "../pages/Admin/Config/Categories";
import Brands from "../pages/Admin/Config/Brands";
import Attributes from "../pages/Admin/Config/Attributes";

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

export const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminHome />}>
                <Route path="sellers" element={ <Sellers/> } />
                <Route path="reviews" element={ <Reviews/> } />
                <Route path="categories" element={ <Categories/> } />
                <Route path="brands" element={ <Brands/> } />
                <Route path="attributes" element={ <Attributes/> } />
            </Route>
        </Routes>
    );
};

export const SellerRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<SellerHome />}>
                <Route path="products" element={ <Products/> } />
                <Route path="orders" element={ <Orders/> } />
            </Route>
        </Routes>
    );
};