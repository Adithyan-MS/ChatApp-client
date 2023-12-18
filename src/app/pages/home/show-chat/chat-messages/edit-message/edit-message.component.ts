import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { message } from '../../../../../models/data-types';

@Component({
  selector: 'app-edit-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-message.component.html',
  styleUrl: './edit-message.component.scss'
})
export class EditMessageComponent implements OnInit{

  @Input() message:message
  @Output() closeEvent = new EventEmitter<any>()
  currentUserId:number
  user:string | null
  
  ngOnInit(): void {
    if(typeof localStorage != "undefined"){
      this.user=localStorage.getItem("user")
      if(this.user)
        this.currentUserId=JSON.parse(this.user).id
    }
  }
  close(){
    this.closeEvent.emit("close")
  }
}
