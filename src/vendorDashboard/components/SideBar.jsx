import React from "react";

const SideBar = ({
  showFirmHandler,
  showProductHandler,
  showAllProductsHandler,
  showUserDetailsHandler,
  showAnalyticsHandler,
  showFirmTitle,
  activeView
}) => {
  const item = (view, icon, label, handler) => (
    <li onClick={handler} className={activeView === view ? 'active' : ''}>
      <span className="sidebar-icon">{icon}</span>
      <span>{label}</span>
    </li>
  );

  return (
    <div className="sideBarSection">
      <span className="sidebar-section-label">Restaurant</span>
      <ul>
        {showFirmTitle && item('firm', '🏪', 'Add Firm', showFirmHandler)}
        {item('product', '➕', 'Add Product', showProductHandler)}
        {item('allProducts', '📦', 'All Products', showAllProductsHandler)}
        {item('analytics', '📊', 'Analytics', showAnalyticsHandler)}
      </ul>

      <div className="sidebar-divider" />
      <span className="sidebar-section-label">Account</span>
      <ul>
        {item('userDetails', '👤', 'User Details', showUserDetailsHandler)}
      </ul>
    </div>
  );
};

export default SideBar;
