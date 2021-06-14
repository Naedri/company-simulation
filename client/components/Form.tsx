export default function Form({ children, onSubmit, style = undefined }) {
    return (
        <form className="add-form" onSubmit={onSubmit} style={style}>
            {children}
        </form>
    );
}
