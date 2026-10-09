import styles from "./Navbar.module.css";
import { NavLink } from "react-router";

function Navbar({ id, isOpen, onNavigate }) {
  return (
    <nav
      id={id}
      className={`${styles["nav"]} ${isOpen ? styles["open"] : ""}`}
      aria-label="Main"
    >
      <ul>
        <li>
          <NavLink to="/" end onClick={onNavigate}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/listing" onClick={onNavigate}>
            Find a service
          </NavLink>
        </li>
        <li>
          <NavLink to="/booking" onClick={onNavigate}>
            Book an appointment
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
