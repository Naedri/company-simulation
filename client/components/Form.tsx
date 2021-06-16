/**
 * Personalised Form element to easier its utilisation
 * @param children of this component
 * @param onSubmit action on click
 * @param style
 * @constructor
 */
export default function Form({ children, onSubmit, style = undefined }) {
    return (
        <form className="add-form" onSubmit={onSubmit} style={style}>
            {children}
        </form>
    );
}
