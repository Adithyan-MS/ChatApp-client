import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinRoomComponent } from './join-room/join-room.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { AddRoomMemberComponent } from './add-room-member/add-room-member.component';
import { AnimationService } from '../../services/animation.service';
import { DataService } from '../../services/data.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ImageHandlerComponent } from './image-handler/image-handler.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule,AlertDialogComponent,CreateRoomComponent,ConfirmationDialogComponent,JoinRoomComponent,AddRoomMemberComponent,ImageHandlerComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations:[AnimationService.prototype.getPopupAnimation(),AnimationService.prototype.getFadeInOutAnimation()]
})
export class ModalComponent implements OnInit{

  modalText: string;
  modalTitle:string
  modelContent: any | undefined;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() confirmationResult: EventEmitter<boolean> = new EventEmitter<boolean>();
  removeCloseIcon:boolean = false

  constructor(){}

  ngOnInit(): void {
    if(this.modalText == "viewImage" || this.modalText == "alert" || this.modalText == "confirmation" || this.modalText == "handleImage")
      this.removeCloseIcon = true
    else
      this.removeCloseIcon = false
  }

  close(event:any){
    this.closeModal.emit(false)
  }
  onCreateSuccess(event:any){
    if(event)
      this.closeModal.emit(event)
  }
  onJoinSuccess(event:any){
    if(event)
      this.closeModal.emit(event)
  }
  onMemberAddSuccess(event:any){
    if (event)
      this.closeModal.emit(event)      
  }
  onConfirmEvent(event:boolean){
      this.closeModal.emit(event)
  }
  onDoneEvent(event:any){
      this.closeModal.emit(event)
  }
  onCancelEvent(event:boolean){
      this.closeModal.emit(event)
  }
  onCloseAlert(event:any){
    if(event){
      this.closeModal.emit(event)
    }
  }
}
