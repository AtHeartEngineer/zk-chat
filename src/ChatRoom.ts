import { Web3Provider } from "@ethersproject/providers"
import { RoomType } from "./types/ChatRoomOptions"
import { UnsubscribeFunction } from "js-waku/lib/waku_filter"
import { ChatMessage } from "./types/ChatMessage"
import { Connection } from "./Connection"
import { RLN } from "./RLN"
import { RLNFullProof } from "rlnjs"

export type MessageStore = {
    message: string
    epoch: bigint
    rlnProof: RLNFullProof | undefined
    alias: string
}

/*
 * Create a chat room
 */
export class ChatRoom {
    public roomType: RoomType
    public chatRoomName: string
    public chatStore: ChatMessage[] // eventually switch to MessageStore[]
    public rlnInstance: RLN
    public provider: Web3Provider | undefined
    public connection: Connection
    private chatMembers: string[]
    public unsubscribeWaku?: UnsubscribeFunction 

    public constructor(
        chatRoomName: string,
        roomType: RoomType,
        chatMembers: string[],
        rlnInstance: RLN,
        provider?: Web3Provider,
    ) {
        this.chatRoomName = chatRoomName
        this.roomType = roomType
        this.provider = provider
        this.rlnInstance = rlnInstance
        this.chatMembers = chatMembers
    }

    /* retrieve Store Messages */
    public async retrieveMessageStore() {
        this.connection.retrieveMessageStore()
    }
    
    /* send a message */
    public async sendMessage(text: string, alias: string, roomName: string) {
        this.connection.sendMessage(text, alias, roomName)
    }

    /* basic util functions */
    public getAllMessages() {
        return this.chatStore
    }
    public getLastMessage() {
        return this.chatStore[-1]
    }
    public async addChatMember(memPubkey: string) {
        if (this.roomType == RoomType.PrivGroup && this.chatMembers.length == 5) {
            console.error('Cannot add more than 5 members to a private group')
        } else {
            this.chatMembers.push(memPubkey)
        }
    }
    public getChatMembers() {
        return this.chatMembers
    }
}