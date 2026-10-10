import styles from "./FormSection.module.css";

// A fieldset with a legend. `small` is the lighter style used for radio questions.
function FormSection({ legend, small = false, children, ...rest }) {
  return (
    <fieldset className={styles["fieldset"]} {...rest}>
      <legend className={small ? styles["legend-small"] : styles["legend"]}>
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

export default FormSection;
