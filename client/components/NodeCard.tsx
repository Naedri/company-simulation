import {useGraphContext} from "../contexts/GraphContext";
import dynamic from "next/dynamic";
const ReactJson = dynamic(
    () => import("react-json-view"),
    { ssr: false }
)

export default function NodeCard() {
    const {selectedNode} = useGraphContext();
    return (
        <ReactJson src={selectedNode} name={false}
                   indentWidth={2}
                   displayDataTypes={false}
                   enableClipboard={false}
                   displayObjectSize={false}
                   quotesOnKeys={false}
                   onEdit={() => {}}
                   theme={"threezerotwofour"}/>
    );
}