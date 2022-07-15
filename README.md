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
import { DeviceManager, getAutomaticFailoverState } from "iconnectivity-js";

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

  // If the device is a PlayAUDIO12,
  // we can get the current failover state.
  const failoverState = await getAutomaticFailoverState({ device });
  console.log({ failoverState });
};

example();
```

## API Usage

This is subject to change, but currently, you can use some wrapper functions for
some commands, with more coming in the future. For example, to fetch the current
failover state:

```ts
import { getAutomaticFailoverState } from "iconnectivity-js";

// The device passed to this function could be
// one of the devices found by the DeviceManager.
const state = await getAutomaticFailoverState({ device });
```

The `device` property doesn't necessarily need to be a device that the
`DeviceManager` outputs. You could also set it to a `Connection` object:

```ts
import { getAutomaticFailoverState } from "iconnectivity-js";

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

### Sending Raw Commands

Even if a given command isn't wrapped by this library yet, you can still call it
and parse the response yourself by using the `sendCommand` function. This
function allows you to For example:

```ts
import { CommandOptions, mergeNumber, sendCommand } from "iconnectivity-js";

/** Returns the number of MIDI ports the given device offers. */
const getMidiPortCount = async (options: CommandOptions) => {
  const result = await sendCommand({
    ...options,
    command: MidiCommand.GetMIDIInfo,
  });

  // The number of ports is stored in the
  // 20th and 21st byte of the response.
  return mergeNumber(result.slice(19, 21));
};

console.log("Port count:", await getMidiPortCount({ device }));
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

## Commands

This list contains all commands currently documented by iConnectivity. The ones
that already have a wrapper function are checked. If you want to contribute to
this list by writing wrapper functions for more commands, feel free to open a
PR.

### Device Commands

- [x] GetDevice
- [x] GetCommandList
- [x] GetInfoList
- [x] GetInfo
- [ ] SetInfo
- [ ] GetResetList
- [ ] GetSaveRestoreList
- [ ] GetEthernetPortInfo
- [ ] SetEthernetPortInfo
- [ ] Reset
- [ ] SaveRestore
- [ ] GetGizmoCount
- [ ] GetGizmoInfo
- [ ] GetDeviceMode
- [ ] SetDeviceMode
- [ ] GetUserData
- [ ] SetUserData

### MIDI Commands

- [ ] GetMIDIInfo
- [ ] SetMIDIInfo
- [ ] GetMIDIPortInfo
- [ ] SetMIDIPortInfo
- [ ] GetMIDIPortFilter
- [ ] SetMIDIPortFilter
- [ ] GetMIDIPortRemap
- [ ] SetMIDIPortRemap
- [ ] GetMIDIPortRoute
- [ ] SetMIDIPortRoute
- [ ] GetMIDIPortDetail
- [ ] SetMIDIPortDetail
- [ ] GetRTPMIDIConnectionDetail
- [ ] GetUSBHostMIDIDeviceDetail
- [ ] GetMIDIMonitor
- [ ] GetRTPMIDIConnectionParm

### Audio Commands (V2)

- [ ] GetAudioGlobalParm
- [ ] SetAudioGlobalParm
- [ ] GetAudioPortParm
- [ ] SetAudioPortParm
- [ ] GetAudioDeviceParm
- [ ] SetAudioDeviceParm
- [ ] GetAudioControlParm
- [ ] SetAudioControlParm
- [ ] GetAudioControlDetail
- [ ] GetAudioControlDetailValue
- [ ] SetAudioControlDetailValue
- [ ] GetAudioClockParm
- [ ] SetAudioClockParm
- [ ] GetAudioPatchbayParm
- [ ] SetAudioPatchbayParm
- [ ] GetAudioChannelName
- [ ] SetAudioChannelName
- [x] GetAudioPortMeterValue

### Audio Mixer Commands

- [ ] GetMixerParm
- [ ] SetMixerParm
- [ ] GetMixerPortParm
- [ ] SetMixerPortParm
- [ ] GetMixerInputParm
- [ ] SetMixerInputParm
- [ ] GetMixerOutputParm
- [ ] SetMixerOutputParm
- [ ] GetMixerInputControl
- [ ] GetMixerOutputControl
- [ ] GetMixerInputControlValue
- [ ] SetMixerInputControlValue
- [ ] GetMixerOutputControlValue
- [ ] SetMixerOutputControlValue
- [ ] GetMixerMeterValue

### Automation Control Commands

- [ ] GetAutomationControl
- [ ] GetAutomationControlDetail
- [ ] SetAutomationControlDetail

### Advanced MIDI Processor (AMP) Commands

- [ ] GetAMPGlobalParm
- [ ] GetAMPAlgorithmParm
- [ ] SetAMPAlgorithmParm
- [ ] GetAMPOperatorParm
- [ ] SetAMPOperatorParm
- [ ] GetAMPCustomRoute
- [ ] SetAMPCustomRoute
- [ ] GetAMPLookupTable
- [ ] SetAMPLookupTable
- [ ] GetAMPPortInfo
- [ ] SetAMPPortInfo

### Snapshot Commands

- [ ] GetSnapshotGlobalParm
- [ ] GetSnapshotParm
- [ ] SetSnapshotParm
- [x] GetSnapshotList
- [ ] SetSnapshotList
- [ ] CreateSnapshot
- [ ] ApplySnapshot
- [ ] ApplySnapshotList

### Hardware Interface Commands

- [ ] GetHardwareGlobalParm
- [ ] GetHardwareParm
- [ ] SetHardwareParm
- [x] GetHardwareValue
- [x] SetHardwareValue
