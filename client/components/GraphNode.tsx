import { FC } from "react";
import { Node } from "../librairies/@types/DiagramSchema";
import { IComponent } from "../utils/model/IComponent";
import styles from "../styles/GraphNode.module.css";
import { setSelectedNode, useGraphContext } from "../contexts/GraphContext";

const GraphNode: FC<Node<IComponent>> = (props) => {
    const { selectedNode, setGraphState } = useGraphContext();

    const handleClick = () => {
        setSelectedNode(props.data, setGraphState);
    };

    const isSelected = selectedNode?.id === props.data.id;
    const styleNode = isSelected ? {
        backgroundColor: "" + props.data.fields.color,
        border: "2px solid #fff",
        transform: "scale(1.5)",
    } : {
        backgroundColor: "" + props.data.fields.color,
    };
    return (
        <div className={styles.component} style={styleNode} onMouseDown={handleClick}>
            <div className={styles.header}>
                {props.id}
            </div>
        </div>
    );
};

export default GraphNode;
