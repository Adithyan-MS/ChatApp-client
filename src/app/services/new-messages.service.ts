import { Injectable } from '@angular/core';
import { ChatInfo, ChatLatestMessageInfo } from '../models/data-types';

@Injectable({
  providedIn: 'root'
})
export class NewMessagesService {

  chatInfo:ChatInfo={}
  openedChat:string

  constructor() { }

  setLatestMessage(chatType:string,chatId:number,messageId:number):void{
    const latestMessageInfo: ChatLatestMessageInfo = {
      latest_message_id: messageId,
      newMessageCount: 0
    };
    this.chatInfo[chatType+chatId] = latestMessageInfo
  }
  
  changeLatestMessage(chatType:string,chatId:number,messageId:number){
    this.chatInfo[chatType+chatId].latest_message_id = messageId
  }

  getLatestMessage(chatType:string,chatId:number):ChatLatestMessageInfo{
    return this.chatInfo[chatType+chatId]
  }

  getNewMessageCount(chatType:string, chatId:number):number{
    return this.chatInfo[chatType+chatId].newMessageCount
  }


  handleMessageReceived(chatType:string,chatId: number) {
    console.log(this.isActiveChat(chatType+chatId));
    
    if (this.isActiveChat(chatType+chatId)) {
      this.chatInfo[chatType+chatId].newMessageCount = 0;
    } else {
      this.chatInfo[chatType+chatId].newMessageCount = this.chatInfo[chatType+chatId].newMessageCount + 1 
    }
  }

  setMessageAsViewed(chatType:string, chatId:number){
    this.chatInfo[chatType+chatId].newMessageCount = 0
  }

  setOpenedChat(chat:string){
    this.openedChat = chat
  }


  // Method to mark chat as opened
  // markChatAsOpened(roomId: string) {
  //   this.unopenedChats[roomId] = false;
  // }

  // Method to mark all messages as read in a room
  // markAsRead(roomId: string) {
  //   this.unreadMessages[roomId] = 0;
  //   // Call API to update server-side status of messages as read
  // }

  // Method to check if a room is active
  isActiveChat(chat: string): boolean {
    if(this.openedChat == chat)
      return true;
    else
      return false
  }
}
