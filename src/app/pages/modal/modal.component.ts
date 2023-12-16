import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinRoomComponent } from './join-room/join-room.component';
import { CreateRoomComponent } from './create-room/create-room.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule,CreateRoomComponent,JoinRoomComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  modalText: string;
  modelContent: string | undefined;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  close(event:any){
    this.closeModal.emit(event)
  }
  onCreateSuccess(event:any){
    if(event){
      this.closeModal.emit(event)
    }
  }
  onJoinSuccess(event:any){
    if(event){
      this.closeModal.emit(event)
    }
  }
}
