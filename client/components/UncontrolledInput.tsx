import Field from "./Field";

/**
 * Input without a State
 */
export default function UncontrolledInput({
                                              id,
                                              type = "text",
                                              name,
                                              required = false,
                                              placeholder = "",
                                              label,
                                              defaultValue = undefined,
                                              pattern = undefined,
                                              ...rest
                                          }) {
    return (
        <Field>
            <label htmlFor={id} className="field__label">
                {label}
            </label>
            <input
                id={id}
                type={type}
                name={name}
                pattern={pattern}
                defaultValue={defaultValue}
                required={required}
                className="field__input"
                placeholder={placeholder}
                {...rest}
            />
        </Field>
    );
}
