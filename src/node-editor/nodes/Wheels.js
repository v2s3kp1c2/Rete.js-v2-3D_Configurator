import { ClassicPreset } from "rete";
import * as Socket from "../sockets";
import { assignMaterialColor } from "../helpers/color";

export class Wheels extends ClassicPreset.Node {
  constructor(car) {
    super("Wheels");
    this.car = car;

    const inp = new ClassicPreset.Input(Socket.color, "Color");

    this.addInput("color", inp);
  }

  data(inputs) {
    const { color } = inputs;

    if (this.car.wheelMaterial) {
      assignMaterialColor(this.car.wheelMaterial, color && color[0]);
    }
    return {};
  }
}
