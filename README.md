# iConnectivity JS

This library allows you to communicate with
[iConnectivity](https://iconnectivity.com) devices using JS and the
[Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API).
It is still in very early development, but the basics already work.

The library's goal is to provide an abstraction layer that allows access to all
methods described in the
[Common System Exclusive Commands](https://downloads.iconnectivity.com/manuals/iConnectivitySYSEXCmds.pdf)
document.

## Getting Started

If you want to check out a demo project, head over to the [demo](packages/demo)
package.

The easiest way to get started is using the `DeviceManager`. Here's an example:

```ts
import { DeviceManager } from "iconnectivity-js";

const example = async () => {
  // Request access to MIDI devices.
  // It's important to request SysEx access as well.
  const midiAccess = await navigator.requestMIDIAccess({ sysex: true });

  // Initialize the device manager.
  // This will automatically trigger a search for devices.
  const manager = new DeviceManager(midiAccess);

  // Wait for the first device(s) to be found.
  const devices = await manager.waitForDevices();

  // At this point, we can be sure that at least one device was found.
  const device = devices[0];

  // Log some information about the device and its state.
  console.log({
    input: device.input.name,
    output: device.output.name,
    info: device.info,
    extendedInfo: await device.getAllInfo(),
  });
};

example();
```

## API Usage

This is subject to change, but currently, functions can generally be imported
from the `commands` directory. For example, to fetch the current failover state:

```ts
import { getAutomaticFailoverState } from "iconnectivity-js/lib/commands/hardware-interface/get-hardware-value";

// The device passed to this function could be
// one of the devices found by the DeviceManager.
const state = await getAutomaticFailoverState({ device });
```

The `device` property doesn't necessarily need to be a device that the
`DeviceManager` outputs. You could also set it to a `Connection` object:

```ts
import { getAutomaticFailoverState } from "iconnectivity-js/lib/commands/hardware-interface/get-hardware-value";

const access = await navigator.requestMIDIAccess({ sysex: true });

// Get the first available MIDI input and output.
const input = access.inputs.values()[0];
const output = access.outputs.values()[0];

// We now send the request to the first MIDI output
// and listen to a response on the first MIDI input.
const state = await getAutomaticFailoverState({
  device: new Connection(input, output),
});
```

## Supported Devices

- mio10
- mio
- iConnectMIDI1
- iConnectMIDI2+
- iConnectMIDI4+
- iConnectAUDIO4+
- iConnectAUDIO2+
- mio2
- mio4
- PlayAUDIO12
- ConnectAUDIO2
- ConnectAUDIO4
