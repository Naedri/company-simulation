import { FC } from "react";
import { Node } from "../librairies/@types/DiagramSchema";
import { Component } from "../model/Component";
import styles from "../styles/GraphNode.module.css";
import { setSelectedNode, useGraphContext } from "../contexts/GraphContext";

const GraphNode: FC<Node<Component>> = (props) => {
    const { selectedNode, setGraphState } = useGraphContext();

    const handleClick = () => {
        setSelectedNode(props.data, setGraphState);
    };

    const isSelected = selectedNode?.id === props.data.id;
    const styleNode = isSelected ? {
        backgroundColor: "" + props.data.color,
        border: "2px solid #fff",
        transform: "scale(1.5)",
    } : {
        backgroundColor: "" + props.data.color,
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
