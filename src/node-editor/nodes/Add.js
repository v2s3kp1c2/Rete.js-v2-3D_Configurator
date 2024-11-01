import { ClassicPreset } from "rete";
import { color } from "../helpers/color";
import * as Socket from "../sockets";

export class Add extends ClassicPreset.Node {
  constructor(change, updateControl) {
    super("Mix");
    this.updateControl = updateControl;

    var inp1 = new ClassicPreset.Input(Socket.value, "Value");
    var inp2 = new ClassicPreset.Input(Socket.value, "Value");
    var out = new ClassicPreset.Output(Socket.value, "Value");

    inp1.addControl(new ClassicPreset.InputControl("text", { change }));
    inp2.addControl(new ClassicPreset.InputControl("text", { change }));

    this.addInput("a", inp1);
    this.addInput("b", inp2);
    this.addControl(
      "preview",
      new ClassicPreset.InputControl("text", { readonly: true })
    );
    this.addOutput("result", out);
  }

  data(inputs) {
    const { a, b } = inputs;

    var n1 = a && a.length ? a[0] : this.inputs["a"].control.value;
    var n2 = b && b.length ? b[0] : this.inputs["b"].control.value;

    var sum = color(n1).mix(color(n2));

    this.controls["preview"].setValue(sum);
    this.updateControl(this.controls["preview"]);

    return {
      result: sum
    };
  }
}
