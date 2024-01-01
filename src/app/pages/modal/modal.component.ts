import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinRoomComponent } from './join-room/join-room.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { AddRoomMemberComponent } from './add-room-member/add-room-member.component';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule,CreateRoomComponent,JoinRoomComponent,AddRoomMemberComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations:[AnimationService.prototype.getPopupAnimation(),AnimationService.prototype.getFadeInOutAnimation()]
})
export class ModalComponent {

  modalText: string;
  modelContent: any | undefined;
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
  onMemberAddSuccess(event:any){
    if (event) {
      this.closeModal.emit(event)      
    }
  }
}
