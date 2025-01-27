import { arrToStr, strToArr } from '../utils/formatting'
import * as protoType from '../proto/ChatMessage'
import { MessageV0 } from 'js-waku/lib/waku_message/version_0'

/* Wrapper for proto */
export class ChatMessage {
  public constructor(public proto: protoType.ChatMessage) {}

  /* Create Chat Message with a utf-8 string as payload. */
  static fromUtf8String(
    text: string,
    epoch: bigint,
    rlnProof?: Uint8Array,
    alias?: string,
  ): ChatMessage {
    const message = strToArr(text)

    return new ChatMessage({
      message, 
      epoch,
      rlnProof,
      alias,
    })
  }

  /* decodes received msg payload from waku */
  static decodeWakuMessage(wakuMsg: MessageV0): ChatMessage | undefined {
    if (wakuMsg.payload) {
      try {
        return ChatMessage.decode(wakuMsg.payload)
      } catch (e) {
        console.error('Failed to decode chat message', e)
      }
    }
    return
  }

  /**
   * Decode a protobuf payload to a ChatMessage.
   * @param bytes The payload to decode.
   */
  static decode(bytes: Uint8Array): ChatMessage {
    const protoMsg = protoType.ChatMessage.decode(bytes)
    // might need to change this, reference zk chat app
    return new ChatMessage(protoMsg)
  }

  /**
   * Encode this ChatMessage to a byte array, to be used as a protobuf payload.
   * @returns The encoded payload.
   */
  encode(): Uint8Array {
    return protoType.ChatMessage.encode(this.proto)
  }

  get epoch(): bigint {
    return this.epoch
  }

  get message(): string {
    return arrToStr(this.proto.message)
  }

  get rlnProof(): Uint8Array | undefined {
    return this.proto.rlnProof
  }

  get alias(): string | undefined {
    return this.alias ?? ''
  }
}