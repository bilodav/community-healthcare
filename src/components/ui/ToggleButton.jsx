import styles from "./ToggleButton.module.css";

// A button that is either on or off, announced as "toggle button, pressed".
// The label never changes with state: aria-pressed carries the state, and
// changing the text as well would be read as a different button.
function ToggleButton({ pressed, onClick, children }) {
  return (
    <button
      type="button"
      className={styles["toggle"]}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {/* Icon is decoration: the state is already in aria-pressed */}
      <span className={styles["icon"]} aria-hidden="true">
        {pressed ? "✓" : "+"}
      </span>
      {children}
    </button>
  );
}

export default ToggleButton;
