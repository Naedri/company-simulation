
export default function LegendType({colorMap}: {colorMap: Record<string, string>}) {
    return (
        <ul>
            {
                Object.entries(colorMap).map(([k, v]) => {
                    const r = k.replace( /([A-Z])/g, " $1" );
                    const toSentenceCase = r.charAt(0).toUpperCase() + r.slice(1);
                    return <li key={k}>
                        {toSentenceCase}:<div className={"color-square"} style={{background: v}}/>
                    </li>
            })
            }
        </ul>
    );
}