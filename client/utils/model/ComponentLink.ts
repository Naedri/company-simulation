import {Link} from "../../librairies/@types/DiagramSchema";

export class ComponentLink implements Link {
    constructor(public input:string, public output:string, public className:string) {}
}