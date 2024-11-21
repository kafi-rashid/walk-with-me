import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/home";
import Product from "../pages/Product/product";
import Login from "../pages/Login/login";
import Register from "../pages/Register/register";
import AdminHome from "../pages/Admin/Home/home";
import Sellers from "../pages/Admin/Sellers/sellers";
import Reviews from "../pages/Admin/Reviews/reviews";
import SellerHome from "../pages/Seller/Home/home";
import Products from "../pages/Seller/Products/products";
import Orders from "../pages/Seller/Orders/orders";
import Categories from "../pages/Admin/Config/Categories/categories";
import Brands from "../pages/Admin/Config/Brands/brands";
import Attributes from "../pages/Admin/Config/Attributes/attributes";
import SubCategories from "../pages/Admin/Config/SubCategories/subcategories";

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
                <Route path="categories/:parentId" element={ <SubCategories/> } />
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