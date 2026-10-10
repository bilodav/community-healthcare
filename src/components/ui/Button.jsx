function Button({
  title,
  className = "btn-primary",
  text = "click me",
  onClick = () => {},
  type,
  disabled = false,
  children,
}) {
  return (
    <button
      type={type}
      title={title}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children ? children : text}
    </button>
  );
}

export default Button;
