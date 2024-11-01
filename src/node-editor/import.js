import { ClassicPreset } from "rete";
import { Add } from "./nodes/Add";
import { Body } from "./nodes/Body";
import { Color } from "./nodes/Color";
import { Wheels } from "./nodes/Wheels";

function createNode(name, data, { process, configurator, updateControl }) {
  if (name === "Mix") return new Add(process, updateControl);
  if (name === "Color") return new Color(data.color, process);
  if (name === "Body") return new Body(configurator.car);
  if (name === "Wheels") return new Wheels(configurator.car);
}

export async function importEditor(
  data,
  { editor, area, process, configurator, updateControl }
) {
  for (const node of data.nodes) {
    const instance = new createNode(node.name, node, {
      process,
      configurator,
      updateControl
    });
    const [x, y] = node.position;

    instance.id = String(node.id);

    await editor.addNode(instance);
    await area.translate(instance.id, { x, y });
  }
  for (const connection of data.connections) {
    const c = new ClassicPreset.Connection(
      editor.getNode(String(connection.source)),
      connection.sourceOutput,
      editor.getNode(String(connection.target)),
      connection.targetInput
    );

    await editor.addConnection(c);
  }
}
