import { ClassicPreset } from "rete";
import * as Socket from "../sockets";
import {
  assignMaterialColor,
  assignMaterialGlossiness
} from "../helpers/color";

export class Body extends ClassicPreset.Node {
  constructor(car) {
    super("Body");
    this.car = car;

    const inp = new ClassicPreset.Input(Socket.color, "Color");
    const inp2 = new ClassicPreset.Input(Socket.color, "Glossiness");

    this.addInput("color", inp);
    this.addInput("gloss", inp2);
  }

  data(inputs) {
    const { color, gloss } = inputs;
    if (this.car.mainMaterial) {
      assignMaterialColor(this.car.mainMaterial, color && color[0]);
      assignMaterialGlossiness(this.car.mainMaterial, gloss && gloss[0]);
    }
    return {};
  }
}
