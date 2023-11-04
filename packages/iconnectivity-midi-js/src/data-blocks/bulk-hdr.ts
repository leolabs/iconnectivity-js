export enum BulkPacketType {
  /** Always the first message in a bulk data transfer operation. */
  BulkStart = 0x01,
  /** Always the last message in a bulk data transfer operation. */
  BulkEnd = 0x02,
  /** Indicates the start of a new chapter. */
  ChapterStart = 0x03,
  /** Indicates the end of the current chapter. */
  ChapterEnd = 0x04,
  /** Indicates that this message contains page data. */
  PageData = 0x05,
  /** Used during handshaking mode or to cancel a bulk data transfer operation. */
  BulkAck = 0x40,
}

// TODO: Implement BulkHdr classes
