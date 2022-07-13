import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";
import { getDevice } from "./commands/device/get-device";
import { Connection } from "./connection";
import { Device } from "./device";
import { isTruthy } from "./util/array";
import { createEventSource } from "./util/event-source";

export class iConnectivity {
  private devices: Device[] = [];
  readonly devicesChanged = createEventSource<(devices: Device[]) => void>();

  constructor(public readonly midiAccess: MIDIAccess) {
    midiAccess.addEventListener("statechange", this.handleMidiStateChange);
    this.handleMidiStateChange();
  }

  handleMidiStateChange = async (e?: Event) => {
    const devices = await this.getDevices();

    if (
      !isEqual(
        devices.map((d) => d.serialNumber),
        this.devices.map((d) => d.serialNumber)
      )
    ) {
      this.devices = devices;
      this.devicesChanged.emit(devices);
    }
  };

  /** Requests MIDI access and scans all ports for iConnectivity devices */
  async getDevices() {
    const inputs = [...this.midiAccess.inputs.values()];
    const answers = await Promise.all(
      [...this.midiAccess.outputs.values()]
        .filter((o) => o.name?.includes("RSV"))
        .map(async (output) => {
          const input = inputs.find((input) => input.name === output.name);

          if (!input) {
            return null;
          }

          try {
            const device = new Connection(input, output);
            const deviceInfo = await getDevice({ device });

            if (deviceInfo) {
              return new Device(input, output, deviceInfo);
            }
          } catch (e) {}

          return null;
        })
    );

    const devices = uniqBy(answers.filter(isTruthy), (d) => d.serialNumber);

    return devices;
  }
}
