import { FC , SyntheticEvent} from "react";
import {Node} from "../librairies/@types/DiagramSchema";
import {Component} from "../model/Component";
import styles from "../styles/GraphNode.module.css";
import {useGraphContext} from "../contexts/GraphContext";

const GraphNode: FC<Node<Component>> = (props) => {
    const {setSelectedNode} = useGraphContext();

    const handleClick = (e: SyntheticEvent) => {
        console.log(props);
        setSelectedNode(props.data);
    }
    return (
        <div className={styles.component} style={{backgroundColor: props.data.color + ""}} onClick={handleClick}>
            <div className={styles.header}>
                {props.id}
            </div>
        </div>
    );
};

export default GraphNode;
