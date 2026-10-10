import { useId } from "react";
import FormSection from "./FormSection";

// Nested fieldset + legend, so the question is announced before each option
function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
  required = false,
}) {
  const id = useId();

  return (
    <FormSection
      legend={
        <>
          {legend}
          {required && (
            <>
              {" "}
              <span className="required">(required)</span>
            </>
          )}
        </>
      }
      small
    >
      {options.map((option) => {
        const inputId = `${id}-${option.value}`;
        return (
          <div className="field-inline" key={option.value}>
            <input
              type="radio"
              id={inputId}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
            />
            <label htmlFor={inputId}>{option.label}</label>
          </div>
        );
      })}
    </FormSection>
  );
}

export default RadioGroup;
