import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinRoomComponent } from './join-room/join-room.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { AddRoomMemberComponent } from './add-room-member/add-room-member.component';
import { AnimationService } from '../../services/animation.service';
import { DataService } from '../../services/data.service';

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
  @Output() confirmationResult: EventEmitter<boolean> = new EventEmitter<boolean>();
  isConfirmation: boolean = false;

  constructor(private dataService:DataService){}

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
  confirm() {
    this.dataService.notifyOther("confirmDelete")
    // this.confirmationResult.emit(true);
    this.closeModal.emit();
  }
  
  cancel() {
    this.dataService.notifyOther("cancelDelete")
    // this.confirmationResult.emit(false);
    this.closeModal.emit();
  }
}
