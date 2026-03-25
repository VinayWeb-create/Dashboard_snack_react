// src/vendorDashboard/pages/LandingPage.jsx
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
import ChangePassword from '../components/ChangePassword';
import VideoPanel from '../components/VideoPanel';
import { ToastProvider, useToast } from '../components/Toast';
import { ConfirmProvider, useConfirm } from '../components/ConfirmModal';

// Views where the video panel should appear on the RIGHT
const VIDEO_PANEL_VIEWS = ['welcome', 'product', 'userDetails'];

// ─────────────────────────────────────────────────────────────────────────────
const LandingPageInner = () => {
  const toast   = useToast();
  const confirm = useConfirm();

  const [showLogin,          setShowLogin]          = useState(false);
  const [showRegister,       setShowRegister]       = useState(false);
  const [showFirm,           setShowFirm]           = useState(false);
  const [showProduct,        setShowProduct]        = useState(false);
  const [showWelcome,        setShowWelcome]        = useState(false);
  const [showAllProducts,    setShowAllProducts]    = useState(false);
  const [showUserDetails,    setShowUserDetails]    = useState(false);
  const [showAnalytics,      setShowAnalytics]      = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLogOut,         setShowLogOut]         = useState(false);
  const [showFirmTitle,      setShowFirmTitle]      = useState(true);
  const [activeView,         setActiveView]         = useState('welcome');

  useEffect(() => {
    const loginToken = localStorage.getItem('loginToken');
    const firmName   = localStorage.getItem('firmName');
    const firmId     = localStorage.getItem('firmId');
    if (loginToken) { setShowLogOut(true); setShowWelcome(true); }
    if (firmName || firmId) { setShowFirmTitle(false); setShowWelcome(true); }
  }, []);

  const logOutHandler = async () => {
    const ok = await confirm('You will be signed out of your vendor account.');
    if (ok) {
      ['loginToken', 'firmId', 'firmName', 'vendorId'].forEach(k => localStorage.removeItem(k));
      setShowLogOut(false); setShowFirmTitle(true);
      setShowWelcome(false); setShowUserDetails(false);
      setShowAnalytics(false); setShowChangePassword(false);
      setActiveView('welcome');
      toast.success('Logged out successfully!');
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
    setShowAnalytics(false);
    setShowChangePassword(false);
  };

  const showLoginHandler = () => {
    resetViews(); setShowLogin(true); setActiveView('login');
  };
  const showRegisterHandler = () => {
    resetViews(); setShowRegister(true); setActiveView('register');
  };
  const showFirmHandler = () => {
    if (showLogOut) { resetViews(); setShowFirm(true); setActiveView('firm'); }
    else { toast.warning('Please login first'); resetViews(); setShowLogin(true); setActiveView('login'); }
  };
  const showProductHandler = () => {
    if (showLogOut) { resetViews(); setShowProduct(true); setActiveView('product'); }
    else { toast.warning('Please login first'); resetViews(); setShowLogin(true); setActiveView('login'); }
  };
  const showWelcomeHandler = () => {
    resetViews(); setShowWelcome(true); setActiveView('welcome');
  };
  const showAllProductsHandler = () => {
    if (showLogOut) { resetViews(); setShowAllProducts(true); setActiveView('allProducts'); }
    else { toast.warning('Please login first'); resetViews(); setShowLogin(true); setActiveView('login'); }
  };
  const showUserDetailsHandler = () => {
    if (showLogOut) { resetViews(); setShowUserDetails(true); setActiveView('userDetails'); }
    else { toast.warning('Please login first'); resetViews(); setShowLogin(true); setActiveView('login'); }
  };
  const showAnalyticsHandler = () => {
    if (showLogOut) { resetViews(); setShowAnalytics(true); setActiveView('analytics'); }
    else { toast.warning('Please login first'); resetViews(); setShowLogin(true); setActiveView('login'); }
  };
  const showChangePasswordHandler = () => {
    if (showLogOut) { resetViews(); setShowChangePassword(true); setActiveView('changePassword'); }
    else { toast.warning('Please login first'); resetViews(); setShowLogin(true); setActiveView('login'); }
  };
  const afterLoginHandler = () => {
    setShowLogOut(true);
    if (localStorage.getItem('firmId') || localStorage.getItem('firmName')) setShowFirmTitle(false);
    resetViews(); setShowWelcome(true); setActiveView('welcome');
  };

  // Show video panel only on the 3 target views
  const showVideoPanel = VIDEO_PANEL_VIEWS.includes(activeView);

  // Guest state (not logged in, nothing selected)
  const showGuest = !showLogOut && !showLogin && !showRegister && !showWelcome;

  return (
    <section className="landingSection">
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
          showAnalyticsHandler={showAnalyticsHandler}
          showChangePasswordHandler={showChangePasswordHandler}
          showFirmTitle={showFirmTitle}
          activeView={activeView}
        />

        {/* Two-column wrapper */}
        <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>

          {/* ── LEFT: main content ── */}
          <div
            className="mainContent"
            style={{
              flex:       showVideoPanel ? '0 0 55%' : '1',
              maxWidth:   showVideoPanel ? '55%'     : '100%',
              overflowY:  'auto',
              transition: 'flex 0.4s cubic-bezier(0.4,0,0.2,1), max-width 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {showFirm           && showLogOut && <AddFirm />}
            {showProduct        && showLogOut && <AddProduct />}
            {showWelcome        && (
              <Welcome
                onAddProduct={showProductHandler}
                onViewProducts={showAllProductsHandler}
                onAnalytics={showAnalyticsHandler}
              />
            )}
            {showAllProducts    && showLogOut && <AllProducts />}
            {showUserDetails    && showLogOut && <UserDetails />}
            {showAnalytics      && showLogOut && <AnalyticsDashboard />}
            {showChangePassword && showLogOut && <ChangePassword />}
            {showLogin          && <Login showWelcomeHandler={afterLoginHandler} />}
            {showRegister       && <Register showLoginHandler={showLoginHandler} />}

            {showGuest && (
              <div style={{ animation: 'fadeUp 0.5s ease both' }}>
                <div className="welcome-hero">
                  <div className="welcome-hero-label">🍽️ Food Vendor Platform</div>
                  <h1>Manage your <span>restaurant</span> with ease</h1>
                  <p>Login or register to start managing your firm, products, and menu.</p>
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
                      onMouseEnter={e => { e.target.style.borderColor = 'var(--border-hover)'; e.target.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { e.target.style.borderColor = 'var(--border)';       e.target.style.color = 'var(--text-secondary)'; }}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Video Panel (welcome, addProduct, userDetails only) ── */}
          {showVideoPanel && (
            <div style={{
              flex:       '0 0 45%',
              maxWidth:   '45%',
              height:     '100%',
              position:   'relative',
              overflow:   'hidden',
              borderLeft: '1px solid var(--border)',
              animation:  'panelSlideIn 0.45s cubic-bezier(0.4,0,0.2,1) both',
            }}>
              <VideoPanel />
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes panelSlideIn {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
      `}</style>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const LandingPage = () => (
  <ToastProvider>
    <ConfirmProvider>
      <LandingPageInner />
    </ConfirmProvider>
  </ToastProvider>
);

export default LandingPage;
