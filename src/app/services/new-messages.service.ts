import { Injectable } from '@angular/core';
import { ChatInfo, ChatLatestMessageInfo } from '../models/data-types';

@Injectable({
  providedIn: 'root'
})
export class NewMessagesService {

  chatInfo:ChatInfo={}

  constructor() { }

  setLatestMessage(chatId:number,messageId:number){
    const latestMessageInfo: ChatLatestMessageInfo = {
      latest_message_id: messageId,
      newMessageCount: 1
    };
    this.chatInfo[chatId] = latestMessageInfo
  }

  getLatestMessage(chatId:number){
    return this.chatInfo[chatId].latest_message_id ? this.chatInfo[chatId].latest_message_id : null
  }

  handleMessageReceived(chatId: number) {
    this.chatInfo[chatId].newMessageCount = this.chatInfo[chatId].newMessageCount + 1 
    // if (this.isActiveRoom(chatId)) {
      // this.unreadMessages[chatId] = 0;
    // } else {
      // this.unreadMessages[chatId] = (this.unreadMessages[chatId] || 0) + 1;
      // this.unopenedChats[chatId] = true;
    // }
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
  isActiveRoom(roomId: string): boolean {
    // Implement logic to check if roomId is the active room
    return true; // Placeholder implementation
  }
}
