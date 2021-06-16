import {Axis, Heading, LineSeries, Plot} from "react-plot";
import {useGraphContext} from "../contexts/GraphContext";


/**
 * Example of a plotting of currency over time.
 * @constructor
 */
export default function SimplePlot() {

    const {dataOverTime} = useGraphContext();

    const dataForGraph = dataOverTime?.map((dataAtTime, index) => {
        const inventory = dataAtTime.find(c => c.id === "inventory");
        const fundsInEur = inventory.fields.funds_in_eur;
        return {
            x: index,
            y: fundsInEur
        }
    })

    if (dataForGraph === undefined || dataForGraph.length < 5)
        return <p>Not enough Data yet</p>

    return <div style={{display: "flex", justifyContent: "center"}}>
        <Plot
            width={550}
            height={500}
            margin={{bottom: 50, left: 90, top: 50, right: 100}}
        >
            <Heading
                title="Funds over time"
            />
            <LineSeries
                data={dataForGraph}
                xAxis="x"
                yAxis="y"
                displayMarker={true}
                markerShape="circle"
            />
            <Axis
                id="x"
                position="bottom"
                label="Iterations"
                displayGridLines={true}
                tickStyle={{fontSize: '0.6rem'}}
            />
            <Axis
                id="y"
                position="left"
                label="Funds in €"
                displayGridLines={true}
                labelSpace={50}
                tickStyle={{fontSize: '0.6rem'}}
            />
        </Plot>
    </div>
}