import { AudioCommand, CommandOptions, getResponseBody, sendCommand } from "..";
import { mergeNumber } from "../../util/number";

export interface AudioGlobalParm {
  audioPortCount: number;
  minBufferedAudioFrames: number;
  maxBufferedAudioFrames: number;
  currentBufferedAudioFrames: number;
  minSyncFactor: number;
  maxSyncFactor: number;
  currentSyncFactor: number;
  activeConfiguration: number;
  configurations: AudioConfiguration[];
}

export interface AudioConfiguration {
  configNumber: number;
  bitDepth: number;
  sampleRate: number;
}

const SAMPLE_RATE_MAP: Record<string, number> = {
  1: 11025,
  2: 12000,
  3: 22050,
  4: 24000,
  5: 44100,
  6: 48000,
  7: 88200,
  8: 96000,
  9: 176400,
  10: 192000,
};

/**
 * This command is used to query a
 * device about global audio parameters.
 */
export const getAudioGlobalParm = async (
  params: CommandOptions
): Promise<AudioGlobalParm> => {
  const response = await sendCommand({
    ...params,
    command: AudioCommand.GetAudioGlobalParm,
  });

  const body = getResponseBody(response);

  const blockCount = body[10];

  const configurations: AudioConfiguration[] = [];

  let pointer = 11;

  for (let i = 0; i < blockCount; i++) {
    configurations.push({
      configNumber: body[pointer],
      bitDepth: body[pointer + 1] * 4,
      sampleRate: SAMPLE_RATE_MAP[String(body[pointer + 2])],
    });
    pointer += 3;
  }

  return {
    audioPortCount: mergeNumber(body.slice(1, 3)),
    minBufferedAudioFrames: body[3],
    maxBufferedAudioFrames: body[4],
    currentBufferedAudioFrames: body[5],
    minSyncFactor: body[6],
    maxSyncFactor: body[7],
    currentSyncFactor: body[8],
    activeConfiguration: body[9],
    configurations,
  };
};
