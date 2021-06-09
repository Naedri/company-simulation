import {FC} from "react";
import { Node } from "beautiful-react-diagrams/@types/DiagramSchema";
import { Component } from "../model/Component";
import styles from "../styles/GraphNode.module.css";

const GraphNode: FC<Node<Component>> = (props) => {
    return (
        <div className={styles.component}>
            <div className={styles.header}>
                {props.id}
            </div>
            <div className={styles.body}>
                {props.content}
            </div>
        </div>
    );
};

export default GraphNode;
