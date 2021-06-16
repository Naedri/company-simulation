import {FC, useState} from "react";
import {Node} from "../librairies/@types/DiagramSchema";
import {IComponent} from "../utils/model/IComponent";
import styles from "../styles/GraphNode.module.css";
import {setSelectedNode, useGraphContext} from "../contexts/GraphContext";
import {usePopper} from "react-popper";

/**
 * Implement NodeGraph to show a customized version of Node
 * @param props contains data
 * @constructor
 */
const GraphNode: FC<Node<IComponent>> = (props) => {
    const {selectedNode, setGraphState} = useGraphContext();
    const [visible, setVisibility] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    const {styles: s, attributes} = usePopper(referenceElement, popperElement, {
        modifiers: [{name: 'arrow', options: {element: arrowElement}}],
    });

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
        <>
            <div ref={setReferenceElement}
                 onPointerOver={() => setVisibility(true)}
                 onPointerOut={() => setVisibility(false)}
                 className={styles.component} style={styleNode} onMouseDown={handleClick}>
                <div className={styles.header}>
                    {props.id}
                </div>
            </div>
            <div ref={setPopperElement}
                 style={{...s.popper,
                     visibility: `${visible ? "visible" : "hidden"}`,
                     backgroundColor: "white",
                     zIndex: 1000,
                     padding: "0.5rem",
                     borderRadius: "6px",
                 }
                 } {...attributes.popper}>
                {props.data.type}
                <div ref={setArrowElement} style={s.arrow}/>
            </div>
        </>
    );
}
export default GraphNode;
