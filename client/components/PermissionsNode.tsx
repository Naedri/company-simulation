import dynamic from "next/dynamic";

const ReactJson = dynamic(
    () => import("react-json-view"),
    {ssr: false}
);

export default function PermissionsNode({permissions, onEdit, onAdd, onDelete}) {
    return (
        <section>
            <ReactJson src={permissions} name={false}
                       displayDataTypes={false}
                       enableClipboard={false}
                       displayObjectSize={false}
                       quotesOnKeys={false}
                       onEdit={onEdit}
                       onAdd={onAdd}
                       onDelete={onDelete}
                       style={{
                           overflowX: "scroll",
                           padding: "30px"
                       }}
                       theme={"monokai"}/>
        </section>
    )
}