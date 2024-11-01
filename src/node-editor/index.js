import { NodeEditor } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import { VuePlugin, Presets as VuePresets } from "rete-vue-plugin/vue2";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets
} from "rete-connection-plugin";
import {
  ContextMenuPlugin,
  Presets as ContextMenuPresets
} from "rete-context-menu-plugin";
import { DataflowEngine } from "rete-engine";
import { Add } from "./nodes/Add";
import { Body } from "./nodes/Body";
import { Color } from "./nodes/Color";
import { Wheels } from "./nodes/Wheels";
import data from "./data.json";
import { importEditor } from "./import";

export default async function (container, configurator) {
  const editor = new NodeEditor();
  const area = new AreaPlugin(container);
  const connection = new ConnectionPlugin();
  const contextMenu = new ContextMenuPlugin({
    items: ContextMenuPresets.classic.setup([
      ["Add", () => new Add(process, updateControl)],
      ["Color", () => new Color("white", process)],
      ["Body", () => new Body(configurator.car)],
      ["Wheels", () => new Wheels(configurator.car)]
    ])
  });

  const render = new VuePlugin();

  render.addPreset(VuePresets.classic.setup());
  render.addPreset(VuePresets.contextMenu.setup());

  connection.addPreset(ConnectionPresets.classic.setup());

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  AreaExtensions.simpleNodesOrder(area);
  AreaExtensions.showInputControl(area);

  editor.use(area);
  area.use(render);
  area.use(connection);
  area.use(contextMenu);

  const engine = new DataflowEngine();

  editor.use(engine);

  function updateControl(control) {
    area.update("control", control.id);
  }

  function process() {
    engine.reset();
    editor.getNodes().forEach(async (node) => {
      try {
        await engine.fetch(node.id);
      } catch (e) {
        if (e && e.message === "cancelled") {
          console.warn("gracefully cancelled");
        } else throw e;
      }
    });
  }

  editor.addPipe((context) => {
    if (["connectioncreated", "connectionremoved"].includes(context.type)) {
      process();
    }
    return context;
  });

  await importEditor(data, {
    editor,
    area,
    process,
    configurator,
    updateControl
  });

  AreaExtensions.zoomAt(area, editor.getNodes());

  setTimeout(() => process(), 1000);
}
