import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SenderService {
  
  private prevSenderName: string;

  constructor() { }

  getPreviousSenderName(): string {
    return this.prevSenderName;
  }

  setPreviousSenderName(senderName: string): void {
    this.prevSenderName = senderName;
  }
}
