import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Login from '../components/forms/Login';
import Register from '../components/forms/Register';
import AddFirm from '../components/forms/AddFirm';
import AddProduct from '../components/forms/AddProduct';
import Welcome from '../components/Welcome';
import AllProducts from '../components/AllProducts';
import UserDetails from '../components/UserDetails';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFirm, setShowFirm] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);
  const [showFirmTitle, setShowFirmTitle] = useState(true);
  const [activeView, setActiveView] = useState('welcome');

  useEffect(() => {
    const loginToken = localStorage.getItem('loginToken');
    const firmName = localStorage.getItem('firmName');
    const firmId = localStorage.getItem('firmId');

    if (loginToken) {
      setShowLogOut(true);
      setShowWelcome(true);
    }
    if (firmName || firmId) {
      setShowFirmTitle(false);
      setShowWelcome(true);
    }
  }, []);

  const logOutHandler = () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("loginToken");
      localStorage.removeItem("firmId");
      localStorage.removeItem("firmName");
      setShowLogOut(false);
      setShowFirmTitle(true);
      setShowWelcome(false);
      setShowUserDetails(false);
      setActiveView('welcome');
      alert("✅ Logged out successfully!");
    }
  };

  const resetViews = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowFirm(false);
    setShowProduct(false);
    setShowWelcome(false);
    setShowAllProducts(false);
    setShowUserDetails(false);
  };

  const showLoginHandler = () => {
    resetViews();
    setShowLogin(true);
    setActiveView('login');
  };

  const showRegisterHandler = () => {
    resetViews();
    setShowRegister(true);
    setActiveView('register');
  };

  const showFirmHandler = () => {
    if (showLogOut) {
      resetViews();
      setShowFirm(true);
      setActiveView('firm');
    } else {
      alert("Please login");
      setShowLogin(true);
    }
  };

  const showProductHandler = () => {
    if (showLogOut) {
      resetViews();
      setShowProduct(true);
      setActiveView('product');
    } else {
      alert("Please login");
      setShowLogin(true);
    }
  };

  const showWelcomeHandler = () => {
    resetViews();
    setShowWelcome(true);
    setActiveView('welcome');
  };

  const showAllProductsHandler = () => {
    if (showLogOut) {
      resetViews();
      setShowAllProducts(true);
      setActiveView('allProducts');
    } else {
      alert("Please login");
      setShowLogin(true);
    }
  };

  const showUserDetailsHandler = () => {
    if (showLogOut) {
      resetViews();
      setShowUserDetails(true);
      setActiveView('userDetails');
    } else {
      alert("Please login");
      setShowLogin(true);
    }
  };

  return (
    <section className='landingSection'>
      <NavBar
        showLoginHandler={showLoginHandler}
        showRegisterHandler={showRegisterHandler}
        showLogOut={showLogOut}
        logOutHandler={logOutHandler}
      />
      <div className="collectionSection">
        <SideBar
          showFirmHandler={showFirmHandler}
          showProductHandler={showProductHandler}
          showAllProductsHandler={showAllProductsHandler}
          showUserDetailsHandler={showUserDetailsHandler}
          showFirmTitle={showFirmTitle}
          activeView={activeView}
        />
        <div className="mainContent">
          {showFirm && showLogOut && <AddFirm />}
          {showProduct && showLogOut && <AddProduct />}
          {showWelcome && (
            <Welcome
              onAddProduct={showProductHandler}
              onViewProducts={showAllProductsHandler}
            />
          )}
          {showAllProducts && showLogOut && <AllProducts />}
          {showUserDetails && showLogOut && <UserDetails />}
          {showLogin && <Login showWelcomeHandler={showWelcomeHandler} />}
          {showRegister && <Register showLoginHandler={showLoginHandler} />}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
