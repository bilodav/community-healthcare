import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import styles from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();
  return (
    <main id="main" tabIndex={-1} className={styles["page-not-found"]}>
      <title>Page not found – Community Clinic</title>
      <div className={styles["text-404"]}>
        <p>404</p>
        <h1>
          Not sure how you got here,
          <span className={styles["text-404-accent"]}> do not worry</span>
        </h1>

        <span className={styles["text-404-end"]}>
          The path ends here but we can help you get back on track
        </span>
      </div>
      <div className={styles["btn-div"]}>
        <Button text="Go Back Home" onClick={() => navigate("/")} />
        <Button
          text="Find a Provider"
          className={"btn-accent"}
          onClick={() => navigate("/listing")}
        />
      </div>
    </main>
  );
}

export default NotFound;
