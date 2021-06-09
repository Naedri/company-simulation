import {useGraphContext} from "../contexts/GraphContext";

export default function NodeCard() {
    const {selectedNode} = useGraphContext();
    return (
        <div>
            {/*<button onClick={() => setSelectedNode((Math.random() as unknown as IComponent))}/>*/}
            <pre>{JSON.stringify(selectedNode, null, 2)}</pre>
        </div>
    );
}