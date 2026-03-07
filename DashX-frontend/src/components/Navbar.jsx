import React from 'react';
import { NavLink, Route, Router } from "react-router-dom";
import "./css/Navbar.css"

const Navbar = () => {
    return (
        <nav>
            <div className="logo">
                <span>
                    Dash
                </span>
                <span>
                    X
                </span>
            </div>
            <div className="bars">
                <ul>
                    <li><span><img src="#" alt="svg" /></span><span><NavLink to={`/dashboard`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Dashboard</NavLink></span></li>
                    <li><span><img src="#" alt="svg" /></span><span><NavLink to={`/analytics`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Analytics</NavLink></span></li>
                    <li><span><img src="#" alt="svg" /></span><span><NavLink to={`/tasks`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Tasks</NavLink></span></li>
                    <li><span><img src="#" alt="svg" /></span><span><NavLink to={`/platform`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Platform</NavLink></span></li>
                </ul>
            </div>



        </nav >
    )
}

export default Navbar
