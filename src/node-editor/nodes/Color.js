import { ClassicPreset } from "rete";
import * as Socket from "../sockets";

export class Color extends ClassicPreset.Node {
  constructor(initial, change) {
    super("Color");
    var out1 = new ClassicPreset.Output(Socket.color, "Color");

    this.addControl(
      "color",
      new ClassicPreset.InputControl("text", { initial, change })
    );
    this.addOutput("color", out1);
  }

  data(inputs) {
    return {
      color: this.controls["color"].value
    };
  }
}
