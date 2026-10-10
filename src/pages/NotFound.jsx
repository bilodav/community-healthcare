import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import styles from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();
  return (
    <section className={styles["page-not-found"]}>
      <div className={styles["text-404"]}>
        <p>404</p>
        <p>
          Not sure how how you got here,
          <span className={styles["text-404-accent"]}> do not worry</span>
        </p>

        <span className={styles["text-404-end"]}>
          The path ends here but we can help you get back on track
        </span>
      </div>
      <div className={styles["btn-div"]}>
        <Button text="Go Back Home" onClick={() => navigate("/")} />
        <Button
          text="Find a Provider"
          className={"btn-accent"}
          onClick={() => navigate("/listings")}
        />
      </div>
    </section>
  );
}

export default NotFound;
