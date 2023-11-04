import { DataClassType } from "../data-classes";
import { Data } from "../util";

export enum MessageClass {
  /** Sent from host to device to exchange session information. */
  HstSesnVal = 0x01,
  /** Sent from host to device to retrieve a list of parameters. */
  GetParmDef = 0x02,
  /** Sent from host to device to retrieve parameter values. */
  GetParmVal = 0x03,
  /** Sent from host to device to retrieve a list of commands. */
  GetCmdDef = 0x04,
  /** Sent from host to device to set parameter values. */
  SetParmVal = 0x10,
  /** Sent from host to device to execute a command. */
  SetCmdVal = 0x11,
  /** Sent from device to host in response to various messages (indicates success or failure). */
  Ack = 0x40,
  /** Sent from device to host in response to a HstSesnVal message (exchange session information). */
  DevSesnVal = 0x41,
  /** Sent from device to host in response to a GetParmDef message (return a parameter list). */
  RetParmDef = 0x42,
  /** Sent from device to host in response to a GetParmVal message (return parameter values). */
  RetParmVal = 0x43,
  /** Sent from device to host in response to a GetCmdDef message (return a command list). */
  RetCmdDef = 0x44,
  /** Sent from a device to a host when parameters are changed on a device that the host did not initiate. */
  NotParmVal = 0x50,
  /** Sent between a device and a host (or another device) to perform bulk data transfer operations (i.e. backup and restore). */
  BulkTransfer = 0x70,
}

export abstract class Message {
  abstract type: MessageClass;
  abstract dataClass: DataClassType;
  abstract getInternalData(): Data;

  /** Returns the entire data block as bytes */
  toData() {
    const data = this.getInternalData();
    return [this.type, this.dataClass, ...data];
  }
}
