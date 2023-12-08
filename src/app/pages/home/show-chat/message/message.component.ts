import { Component,Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  User, message } from '../../../../models/data-types';
import { AppService } from '../../../../services/app.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit{

  @Input() message:message
  chatMessage:message
  currentUserId:number
  user:User|any
  sendTime:string

  constructor(private appService: AppService){}

  ngOnInit(): void {
    this.user = localStorage.getItem("user");
    this.currentUserId = JSON.parse(this.user).id;
    this.chatMessage=this.message;
    this.sendTime = this.appService.HHMMFormatter(this.message.modified_at);
  }

}
