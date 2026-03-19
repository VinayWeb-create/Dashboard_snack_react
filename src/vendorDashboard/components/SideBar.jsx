import React from "react";

const SideBar = ({
  showFirmHandler,
  showProductHandler,
  showAllProductsHandler,
  showUserDetailsHandler,
  showFirmTitle,
  activeView
}) => {
  return (
    <div className="sideBarSection">
      <span className="sidebar-section-label">Menu</span>
      <ul>
        {showFirmTitle && (
          <li
            onClick={showFirmHandler}
            className={activeView === 'firm' ? 'active' : ''}
          >
            <span className="sidebar-icon">🏪</span>
            <span>Add Firm</span>
          </li>
        )}
        <li
          onClick={showProductHandler}
          className={activeView === 'product' ? 'active' : ''}
        >
          <span className="sidebar-icon">➕</span>
          <span>Add Product</span>
        </li>
        <li
          onClick={showAllProductsHandler}
          className={activeView === 'allProducts' ? 'active' : ''}
        >
          <span className="sidebar-icon">📦</span>
          <span>All Products</span>
        </li>
      </ul>

      <div className="sidebar-divider" />
      <span className="sidebar-section-label">Account</span>

      <ul>
        <li
          onClick={showUserDetailsHandler}
          className={activeView === 'userDetails' ? 'active' : ''}
        >
          <span className="sidebar-icon">👤</span>
          <span>User Details</span>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
