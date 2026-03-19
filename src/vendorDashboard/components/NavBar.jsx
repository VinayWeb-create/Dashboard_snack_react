import React from 'react'

const NavBar = ({ showLoginHandler, showRegisterHandler, showLogOut, logOutHandler }) => {
  const firmName = localStorage.getItem('firmName')

  return (
    <div className="navSection">
      <div className="nav-logo">
        <div className="nav-logo-icon">🍽️</div>
        <div className="nav-logo-text">Vendor<span>Hub</span></div>
      </div>

      <div className="nav-center">
        <div className="nav-center-dot" />
        {firmName ? (
          <span className="firmNameBadge">{firmName}</span>
        ) : (
          <span>No firm selected</span>
        )}
      </div>

      <div className="nav-right">
        <div className="userAuth">
          {!showLogOut ? (
            <>
              <button className="nav-btn" onClick={showLoginHandler}>Login</button>
              <button className="nav-btn nav-btn-primary" onClick={showRegisterHandler}>Register</button>
            </>
          ) : (
            <button className="logout-btn" onClick={logOutHandler}>
              <span>⏻</span> Logout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar
