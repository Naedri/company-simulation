import {useGraphContext} from "../contexts/GraphContext";
import dynamic from "next/dynamic";
import {InteractionProps} from "react-json-view";
import {IComponent} from "../utils/model/IComponent";
import {setState} from "../utils/rest/simulation";
import {useToasts} from "react-toast-notifications";

const ReactJson = dynamic(
    () => import("react-json-view"),
    {ssr: false}
);

export default function NodeCard() {
    const {selectedNode, graphData, setGraphState} = useGraphContext();

    const {addToast} = useToasts();

    if (!graphData) return <div className="loader"/>;

    const handleEdit = async (i: InteractionProps) => {
        const copyGraph = graphData.map(c => {
            if (c.id === (i.existing_src as IComponent).id) return i.updated_src as IComponent;
            return ({...c});
        });
        await setState(copyGraph).catch(() => addToast("Not implemented", {
                appearance: "error",
                autoDismiss: true,
            })
        )
        ;
        //setGraphData(copyGraph, setGraphState);
    };
    const dataFromJson = graphData?.find(component => component.id === selectedNode?.id) || {_: "No node selected"};
    return (
        <section>
            <ReactJson src={dataFromJson} name={false}
                       displayDataTypes={false}
                       enableClipboard={false}
                       displayObjectSize={false}
                       quotesOnKeys={false}
                       onEdit={handleEdit}
                       collapsed={3}
                       style={{
                           overflowX: "scroll",
                           padding: "30px",
                           height: "233px"
                       }}
                       theme={"monokai"}/>
        </section>
    );
}
