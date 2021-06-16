import {
    Slider,
    SliderInput,
    SliderTrack,
    SliderRange,
    SliderHandle,
    SliderMarker,
} from "@reach/slider";
import "@reach/slider/styles.css";

export default function ExampleComposed() {
    return (
        <SliderInput min={0} max={200} step={10}>
            <SliderTrack>
                <SliderRange />
                <SliderHandle />
            </SliderTrack>
        </SliderInput>
    );
}