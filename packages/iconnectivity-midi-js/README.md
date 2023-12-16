# iConnectivity JS

[View the Live Demo](https://icjs.leolabs.org) |
[NPM](https://npmjs.com/package/iconnectivity-midi-js)

This library allows you to communicate with newer
[iConnectivity](https://iconnectivity.com) devices using JS and the
[Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API).
It is still in very early development, but the basics already work.

The library's goal is to provide an abstraction layer that allows access to all
methods described in the
[Common System Exclusive Commands](https://www.iconnectivity.com/s/Common-System-Exclusive-Commands-TNG.pdf)
document.

## Getting Started

If you want to check out a demo project, head over to the [demo](packages/demo)
package.

The easiest way to get started is using the `DeviceManager`. Here's an example:

```ts
import {
  DeviceManager,
  getDeviceName,
  getFailoverState,
} from "iconnectivity-midi-js";

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
    name: await getDeviceName({ device }),
  });

  // If the device is a PlayAUDIO1U,
  // we can get the current failover state.
  const failoverState = await getFailoverState({ device });
  console.log({ failoverState });
};

example();
```

## API Usage

You can use wrapper functions for supported commands, with more coming in the
future. A list of supported commands can be found [below](#commands). For
example, to fetch the current failover state:

```ts
import { getFailoverState } from "iconnectivity-midi-js";

// The device passed to this function could be
// one of the devices found by the DeviceManager.
const state = await getFailoverState({ device });
```

The `device` property doesn't necessarily need to be a device that the
`DeviceManager` outputs. You could also set it to a custom `Connection` object:

```ts
import { getFailoverState } from "iconnectivity-midi-js";

const access = await navigator.requestMIDIAccess({ sysex: true });

// Get the first available MIDI input and output.
const input = access.inputs.values()[0];
const output = access.outputs.values()[0];

// We now send the request to the first MIDI output
// and listen to a response on the first MIDI input.
const state = await getFailoverState({
  device: new Connection(input, output),
});
```

### Sending Raw Commands

Even if a given command isn't wrapped by this library yet, you can still call it
and parse the response yourself by using the `sendMessage` function. This
function allows you to For example:

```ts
import {
  DataClassType,
  DeviceInfo,
  GetParmVal,
  getResponseBody,
  MessageOptions,
  mergeNumber,
  RetParmVal,
  sendMessage,
} from "iconnectivity-midi-js";

/** Returns the number of MIDI ports the given device offers. */
const getPortCounts = async (options: MessageOptions) => {
  const result = await sendMessage({
    ...options,
    message: new GetParmVal(DataClassType.DeviceInfo, undefined, [
      new ParmList([
        DeviceInfo.DINInPortCount,
        DeviceInfo.DINOutPortCount,
        DeviceInfo.USBDPortCount,
        DeviceInfo.USBHPortCount,
        DeviceInfo.EthPortCount,
        DeviceInfo.CtrlPortCount,
      ]),
    ]),
  });

  const body = getResponseBody(result);
  const values = RetParmVal.fromData(body);

  return {
    midiIn: values.parmVals[0].values[0].data[0],
    midiOut: values.parmVals[0].values[1].data[0],
    usbDevice: values.parmVals[0].values[2].data[0],
    usbHost: values.parmVals[0].values[3].data[0],
    ethernet: values.parmVals[0].values[4].data[0],
    control: values.parmVals[0].values[5].data[0],
  };
};

console.log("Port count:", await getPortCount({ device }));
```

## Supported Devices

- MioXL
- MioXM
- MioXC
- PlayAUDIO1U
