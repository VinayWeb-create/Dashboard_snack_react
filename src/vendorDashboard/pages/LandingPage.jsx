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
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { ToastProvider, useToast } from '../components/Toast';
import { ConfirmProvider, useConfirm } from '../components/ConfirmModal';

// ─── Inner component has access to toast & confirm hooks ────────────────────
const LandingPageInner = () => {
  const toast   = useToast();
  const confirm = useConfirm();

  // ── All original view states preserved ───────────────────────────────────
  const [showLogin,       setShowLogin]       = useState(false);
  const [showRegister,    setShowRegister]    = useState(false);
  const [showFirm,        setShowFirm]        = useState(false);
  const [showProduct,     setShowProduct]     = useState(false);
  const [showWelcome,     setShowWelcome]     = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showLogOut,      setShowLogOut]      = useState(false);
  const [showFirmTitle,   setShowFirmTitle]   = useState(true);
  const [activeView,      setActiveView]      = useState('welcome');

  // ── NEW: analytics view state ─────────────────────────────────────────────
  const [showAnalytics, setShowAnalytics] = useState(false);

  // ── On mount: restore session ─────────────────────────────────────────────
  useEffect(() => {
    const loginToken = localStorage.getItem('loginToken');
    const firmName   = localStorage.getItem('firmName');
    const firmId     = localStorage.getItem('firmId');

    if (loginToken) {
      setShowLogOut(true);
      setShowWelcome(true);
    }
    if (firmName || firmId) {
      setShowFirmTitle(false);
      setShowWelcome(true);
    }
  }, []);

  // ── Logout (replaces window.confirm + alert) ──────────────────────────────
  const logOutHandler = async () => {
    const ok = await confirm('You will be signed out of your vendor account.');
    if (ok) {
      localStorage.removeItem('loginToken');
      localStorage.removeItem('firmId');
      localStorage.removeItem('firmName');
      localStorage.removeItem('vendorId');
      setShowLogOut(false);
      setShowFirmTitle(true);
      setShowWelcome(false);
      setShowUserDetails(false);
      setShowAnalytics(false);
      setActiveView('welcome');
      toast.success('Logged out successfully!');
    }
  };

  // ── Reset all view flags ──────────────────────────────────────────────────
  const resetViews = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowFirm(false);
    setShowProduct(false);
    setShowWelcome(false);
    setShowAllProducts(false);
    setShowUserDetails(false);
    setShowAnalytics(false);
  };

  // ── Original handlers (alert → toast.warning) ─────────────────────────────
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
      toast.warning('Please login first');
      resetViews();
      setShowLogin(true);
      setActiveView('login');
    }
  };

  const showProductHandler = () => {
    if (showLogOut) {
      resetViews();
      setShowProduct(true);
      setActiveView('product');
    } else {
      toast.warning('Please login first');
      resetViews();
      setShowLogin(true);
      setActiveView('login');
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
      toast.warning('Please login first');
      resetViews();
      setShowLogin(true);
      setActiveView('login');
    }
  };

  const showUserDetailsHandler = () => {
    if (showLogOut) {
      resetViews();
      setShowUserDetails(true);
      setActiveView('userDetails');
    } else {
      toast.warning('Please login first');
      resetViews();
      setShowLogin(true);
      setActiveView('login');
    }
  };

  // ── NEW: analytics handler ────────────────────────────────────────────────
  const showAnalyticsHandler = () => {
    if (showLogOut) {
      resetViews();
      setShowAnalytics(true);
      setActiveView('analytics');
    } else {
      toast.warning('Please login first');
      resetViews();
      setShowLogin(true);
      setActiveView('login');
    }
  };

  // ── Called after successful login to update header + show welcome ─────────
  const afterLoginHandler = () => {
    setShowLogOut(true);
    const firmId   = localStorage.getItem('firmId');
    const firmName = localStorage.getItem('firmName');
    if (firmId || firmName) setShowFirmTitle(false);
    resetViews();
    setShowWelcome(true);
    setActiveView('welcome');
  };

  return (
    <section className="landingSection">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <NavBar
        showLoginHandler={showLoginHandler}
        showRegisterHandler={showRegisterHandler}
        showLogOut={showLogOut}
        logOutHandler={logOutHandler}
      />

      <div className="collectionSection">

        {/* ── Sidebar ────────────────────────────────────────────────────────── */}
        <SideBar
          showFirmHandler={showFirmHandler}
          showProductHandler={showProductHandler}
          showAllProductsHandler={showAllProductsHandler}
          showUserDetailsHandler={showUserDetailsHandler}
          showAnalyticsHandler={showAnalyticsHandler}
          showFirmTitle={showFirmTitle}
          activeView={activeView}
        />

        {/* ── Main content ───────────────────────────────────────────────────── */}
        <div className="mainContent">

          {/* Add Firm */}
          {showFirm && showLogOut && <AddFirm />}

          {/* Add Product */}
          {showProduct && showLogOut && <AddProduct />}

          {/* Welcome home */}
          {showWelcome && (
            <Welcome
              onAddProduct={showProductHandler}
              onViewProducts={showAllProductsHandler}
              onAnalytics={showAnalyticsHandler}
            />
          )}

          {/* All Products — search + filter + edit */}
          {showAllProducts && showLogOut && <AllProducts />}

          {/* User Details */}
          {showUserDetails && showLogOut && <UserDetails />}

          {/* Analytics Dashboard */}
          {showAnalytics && showLogOut && <AnalyticsDashboard />}

          {/* Login */}
          {showLogin && (
            <Login showWelcomeHandler={afterLoginHandler} />
          )}

          {/* Register */}
          {showRegister && (
            <Register showLoginHandler={showLoginHandler} />
          )}

          {/* Guest landing — nothing is selected and user is logged out */}
          {!showLogOut &&
           !showLogin &&
           !showRegister &&
           !showWelcome && (
            <div style={{ animation: 'fadeUp 0.5s ease both' }}>
              <div className="welcome-hero">
                <div className="welcome-hero-label">🍽️ Food Vendor Platform</div>
                <h1>
                  Manage your <span>restaurant</span> with ease
                </h1>
                <p>
                  Login or register to start managing your firm, products,
                  and menu — all from one powerful dashboard.
                </p>
                <div className="welcome-actions">
                  <div className="btnSubmit" style={{ margin: 0 }}>
                    <button onClick={showLoginHandler}>Login →</button>
                  </div>
                  <button
                    onClick={showRegisterHandler}
                    style={{
                      background:   'transparent',
                      border:       '1px solid var(--border)',
                      color:        'var(--text-secondary)',
                      padding:      '11px 24px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize:     '0.88rem',
                      fontWeight:   600,
                      cursor:       'pointer',
                      fontFamily:   'DM Sans, sans-serif',
                      transition:   'var(--transition)',
                    }}
                    onMouseEnter={e => {
                      e.target.style.borderColor = 'var(--border-hover)';
                      e.target.style.color       = 'var(--text-primary)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.color       = 'var(--text-secondary)';
                    }}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>{/* end mainContent */}
      </div>{/* end collectionSection */}
    </section>
  );
};

// ─── Root export — wraps providers so hooks work in the whole tree ───────────
const LandingPage = () => (
  <ToastProvider>
    <ConfirmProvider>
      <LandingPageInner />
    </ConfirmProvider>
  </ToastProvider>
);

export default LandingPage;
