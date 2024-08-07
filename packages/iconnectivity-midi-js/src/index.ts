import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";

import { Connection } from "./connection";
import { Device } from "./device";
import { Product } from "./types/product";
import { isTruthy } from "./util/array";
import { createEventSource } from "./util/event-source";
import { discoverDevice } from "./functions";
import { getOpMode } from "./functions/get-opmode";
import { OpMode } from "./data-classes";

/**
 * The DeviceManager is responsible for discovering and managing iConnectivity
 * devices. It automatically searches for and maintains a list of devices.
 *
 * To initialize the DeviceManager, you need to pass in a MIDIAccess object.
 * You can obtain it by calling `navigator.requestMIDIAccess({ sysex: true })`.
 */
export class DeviceManager {
  private _devices: Device[] = [];
  private _midiInputIds: string[] = [];
  readonly devicesChanged = createEventSource<(devices: Device[]) => void>();
  private _product: Product | undefined;

  constructor(public readonly midiAccess: MIDIAccess, product?: Product) {
    this._product = product;
    midiAccess.addEventListener("statechange", this.handleMidiStateChange);
    this.handleMidiStateChange();
  }

  destroy() {
    this.midiAccess.removeEventListener(
      "statechange",
      this.handleMidiStateChange
    );
  }

  get devices(): readonly Device[] {
    return this._devices;
  }

  get product() {
    return this._product;
  }

  set product(product: Product | undefined) {
    this._product = product;
    this.handleMidiStateChange();
  }

  handleMidiStateChange = debounce(async () => {
    const inputIds = [...this.midiAccess.inputs.values()].map((i) => i.id);

    if (isEqual(this._midiInputIds, inputIds)) {
      return;
    }

    this._midiInputIds = inputIds;
    const devices = await this.getDevices();

    if (
      !isEqual(
        devices.map((d) => d.serialNumber),
        this._devices.map((d) => d.serialNumber)
      )
    ) {
      this._devices = devices;
      this.devicesChanged.emit(devices);
    }
  }, 100);

  /** Requests MIDI access and scans all ports for iConnectivity devices */
  async getDevices() {
    const inputs = [...this.midiAccess.inputs.values()];

    const answers = await Promise.all(
      [...this.midiAccess.outputs.values()]
        .reverse() // We want to use the device's last available port
        // On Windows, the manufacturer might be empty, so we'll try those too
        .filter((o) => o.manufacturer === "iConnectivity" || !o.manufacturer)
        .map(async (output) => {
          const input = inputs.find((input) => input.name === output.name);

          if (!input) {
            return null;
          }

          try {
            // Explicitly try to open the device's MIDI ports
            await input.open();
            await output.open();

            const device = new Connection(input, output);
            const serial = await discoverDevice({
              device,
              productId: this._product,
            });

            if (!serial) {
              return null;
            }

            const opMode = await getOpMode({ device });

            // Ignore devices in Bootloader mode
            if (opMode === OpMode.Bootloader) {
              return null;
            }

            return new Device(input, output, serial);
          } catch (e) {
            console.warn(
              `Couldn't connect to ${output.name} because of error:`,
              e
            );
            // fall-through to the null return
          }

          return null;
        })
    );

    const devices = uniqBy(
      answers.filter(isTruthy),
      (d) => d.serialNumberString
    );

    // Close MIDI ports of unused devices
    for (const output of this.midiAccess.outputs.values()) {
      const input = inputs.find((input) => input.name === output.name);

      if (!input || devices.some((d) => d.output.id === output.id)) {
        continue;
      }

      await input.close();
      await output.close();
    }

    return devices;
  }

  /**
   * Waits for the first device(s) to be found and returns them.
   * If devices are already found, this returns immediately.
   */
  async waitForDevices() {
    if (this._devices.length) {
      return this._devices;
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

export * from "./commands";
export * from "./data-classes";
export * from "./functions";
export * from "./messages";
export * from "./types";
export * from "./util";

export * from "./connection";
export * from "./device";
