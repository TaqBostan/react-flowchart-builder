import { ns } from './types'
export default class Util {
    static len = (v: number[]) => Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
    static createLabelInput(width: number, height: number, x: number, y: number, text: string | undefined) {
        let f = document.createElementNS(ns, 'foreignObject') as SVGForeignObjectElement;
        let div = document.createElement('div');
        let input = document.createElement('input');
        f.setAttribute("width", `${width}`);
        f.setAttribute("height", `${height}`);
        f.setAttribute("x", x.toString());
        f.setAttribute("y", y.toString());
        div.setAttribute("xmlns", ns);
        if (text) input.value = text;
        input.setAttribute("class", 'lbl-input');
        input.style.width = width + "px";
        div.append(input);
        f.append(div);
        return { foreign: f, input };
      }
}