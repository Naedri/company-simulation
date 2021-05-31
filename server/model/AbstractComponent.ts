import {IComponent, instanceOfIComponent} from "./IComponent";
import {IComponentSimplified} from "./IComponentSimplified";

export abstract class AbstractComponent implements IComponent {

    abstract id: string;
    abstract type: string;

    [key: string]: IComponent | string | number | boolean | null | Object;

    toComponentSimplified(): IComponentSimplified {
        let copy = {
            id: this.id,
            type: this.type
        } as IComponentSimplified;

        Object.entries(this).forEach(([key, value]) => {
            if (instanceOfIComponent(value)) {
                copy = {...copy, [key]: value.id};
            } else {
                copy = {...copy, [key]: value};
            }
        });
        return copy;
    }
}