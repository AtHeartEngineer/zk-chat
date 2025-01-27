import { Web3Provider } from '@ethersproject/providers'
import { RoomType } from './types/ChatRoomOptions'
import { Connection } from './Connection'
import RLN from './RLN'
import User from './User'

/*
 * Create a chat room
 */
export default class ChatRoom {
  public roomType: RoomType

  public chatRoomName: string

  public rlnInstance: RLN

  public provider: Web3Provider | undefined

  public connection: Connection

  private chatMembers: User[]

  public constructor(
    chatRoomName: string,
    roomType: RoomType,
    chatMembers: User[],
    rlnInstance: RLN,
    connection: Connection,
    provider?: Web3Provider,
  ) {
    this.chatRoomName = chatRoomName
    this.roomType = roomType
    this.provider = provider
    this.rlnInstance = rlnInstance
    this.chatMembers = chatMembers
    this.connection = connection
  }

  /* retrieve Store Messages */
  public async retrieveMessageStore() {
    return this.connection.retrieveMessageStore(this.chatRoomName) // content topic
  }

  /* send a message */
  public async sendMessage(text: string, alias: string) {
    try {
      await this.connection.sendMessage(text, alias, this.chatRoomName)
    } catch (error) {
      console.log('error sending message', text)
    }
  }

  /* add chat member */
  public async addChatMember(member: User) {

    if (this.roomType == RoomType.PrivGroup && this.chatMembers.length == 5) {
      console.error('Cannot add more than 5 members to a private group')
    } else {
      this.chatMembers.push(member)
    }
    return member
  }

  public getChatMembers() {
    return this.chatMembers
  }
}