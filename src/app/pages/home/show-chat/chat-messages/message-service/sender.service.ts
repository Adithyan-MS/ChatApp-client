import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SenderService {
  
  private prevSenderName: string;
  private selectedMessageId: number|null

  constructor() { }

  getPreviousSenderName(): string {
    return this.prevSenderName;
  }

  setPreviousSenderName(senderName: string): void {
    this.prevSenderName = senderName;
  }

  setSelectedMessageId(messageId: number|null): void {
    this.selectedMessageId = messageId
  }

  getSelectedMessageId():number|null {
    return this.selectedMessageId
  }
}
