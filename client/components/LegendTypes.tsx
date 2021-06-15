import { useGraphContext } from "../contexts/GraphContext";
import { useEffect } from "react";

export default function LegendType({ colorMap }: {colorMap: Record<string, string>}) {
    const { selectedNode } = useGraphContext();
    // useEffect(() => {
    //     if(selectedNode) document.getElementById(selectedNode.type)?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest", alignToTop: false });
    // }, [selectedNode]);
    return (
        <ul>
            {
                Object.entries(colorMap).map(([k, v]) => {
                    const r = k.replace(/([A-Z])/g, " $1");
                    const toSentenceCase = r.charAt(0).toUpperCase() + r.slice(1);
                    const typeIsSelected = selectedNode?.type === k;
                    const val = typeIsSelected ? <strong style={{ color: "red", fontSize: "0.95rem" }}>{toSentenceCase}</strong> : toSentenceCase;
                    return <li key={k}>
                        {val}:<div id={k} className={"color-square"} style={{ background: v }}/>
                    </li>;
            })
            }
        </ul>
    );
}
