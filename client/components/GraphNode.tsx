import { FC , SyntheticEvent} from "react";
import {Node} from "../librairies/@types/DiagramSchema";
import {Component} from "../model/Component";
import styles from "../styles/GraphNode.module.css";
import {useGraphContext} from "../contexts/GraphContext";

const GraphNode: FC<Node<Component>> = (props) => {
    const {selectedNode, setSelectedNode} = useGraphContext();

    const handleClick = (e: SyntheticEvent) => {
        console.log(props);
        setSelectedNode(props.data);
    }

    const isSelected = selectedNode?.id === props.data.id;
    return (
        <div className={styles.component} style={{backgroundColor: props.data.color + "", border: `${isSelected ? "2px solid #fff": ""}`}} onClick={handleClick}>
            <div className={styles.header}>
                {props.id}
            </div>
        </div>
    );
};

export default GraphNode;
