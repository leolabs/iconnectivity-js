import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";
import { getCommandList } from "./commands/device/get-command-list";

import { getDevice } from "./commands/device/get-device";
import { Connection } from "./connection";
import { Device } from "./device";
import { Product } from "./types/product";
import { isTruthy } from "./util/array";
import { createEventSource } from "./util/event-source";

export * from "./commands";
export * from "./connection";
export * from "./device";
export * from "./types";

/**
 * The DeviceManager is responsible for discovering and managing iConnectivity
 * devices. It automatically searches for and maintains a list of devices.
 *
 * To initialize the DeviceManager, you need to pass in a MIDIAccess object.
 * You can obtain it by calling `navigator.requestMIDIAccess({ sysex: true })`.
 */
export class DeviceManager {
  private devices: Device[] = [];
  readonly devicesChanged = createEventSource<(devices: Device[]) => void>();
  private _product: Product | undefined;

  constructor(public readonly midiAccess: MIDIAccess, product?: Product) {
    this._product = product;
    midiAccess.addEventListener("statechange", this.handleMidiStateChange);
    this.handleMidiStateChange();
  }

  get product() {
    return this._product;
  }

  set product(product: Product | undefined) {
    this._product = product;
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
              const supportedCommands = await getCommandList({
                device,
                serialNumber: deviceInfo.serialNumber,
              });

              if (supportedCommands) {
                return new Device(input, output, deviceInfo, supportedCommands);
              }
            }
          } catch (e) {}

          return null;
        })
    );

    const devices = uniqBy(answers.filter(isTruthy), (d) => d.serialNumber);

    return devices;
  }

  /**
   * Waits for the first device(s) to be found and returns them.
   * If devices are already found, this returns immediately.
   */
  async waitForDevices() {
    if (this.devices.length) {
      return this.devices;
    } else {
      return new Promise((resolve) => {
        const unsubscribe = this.devicesChanged.addListener((devices) => {
          if (devices.length) {
            unsubscribe();
            resolve(devices);
          }
        });
      });
    }
  }
}
