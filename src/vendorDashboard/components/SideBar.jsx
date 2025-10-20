import React from "react";

const SideBar = ({
  showFirmHandler,
  showProductHandler,
  showAllProductsHandler,
  showFirmTitle,
  showUserDetailsHandler
}) => {
  return (
    <div className="sideBarSection">
      <ul>
        {showFirmTitle && <li onClick={showFirmHandler}>Add Firm</li>}
        <li onClick={showProductHandler}>Add Product</li>
        <li onClick={showAllProductsHandler}>All Products</li>
        <li onClick={showUserDetailsHandler}>User Details</li>
      </ul>
    </div>
  );
};

export default SideBar;
