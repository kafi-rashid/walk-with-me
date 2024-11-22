import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Buyer/Home/home";
import Product from "../pages/Buyer/Product/product";
import Login from "../pages/Login/login";
import Register from "../pages/Register/register";
import AdminHome from "../pages/Admin/Home/home";
import Sellers from "../pages/Admin/Users/sellers";
import Reviews from "../pages/Admin/Reviews/reviews";
import SellerHome from "../pages/Seller/Home/home";
import Products from "../pages/Seller/Products/products";
import Orders from "../pages/Seller/Orders/orders";
import Categories from "../pages/Admin/Config/Categories/categories";
import Brands from "../pages/Admin/Config/Brands/brands";
import Attributes from "../pages/Admin/Config/Attributes/attributes";
import SubCategories from "../pages/Admin/Config/SubCategories/subcategories";
import Buyers from "../pages/Admin/Users/buyers";
import PendingSellers from "../pages/Admin/Users/pending-sellers";
import ProductDetails from "../pages/Seller/Product/product";
import Cart from "../pages/Buyer/Cart/cart";
import Profile from "../pages/Buyer/Profile/profile";
import Category from "../pages/Buyer/Category/category";
import Search from "../pages/Buyer/Search/search";

export const AuthRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={ <Home/> }/>
            <Route path="/products" element={ <Products/> }/>
            <Route path="/products/:id" element={ <Product/> }/>
            <Route path="/categories/:cat" element={ <Category/> }/>
            <Route path="/categories/:cat/sub-categories/:sub" element={ <Category/> }/>
            <Route path="/profile" element={ <Profile/> }/>
            <Route path="/search" element={ <Search/> }/>
            <Route path="/cart" element={ <Cart/> }/>
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
                <Route path="users/sellers" element={ <Sellers/> } />
                <Route path="users/buyers" element={ <Buyers/> } />
                <Route path="users/sellers/pending" element={ <PendingSellers/> } />
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
                <Route path="products/:id" element={ <ProductDetails/> } />
                <Route path="products/add" element={ <ProductDetails/> } />
                <Route path="orders" element={ <Orders/> } />
            </Route>
        </Routes>
    );
};