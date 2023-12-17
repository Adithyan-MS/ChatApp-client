import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participant } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';
import { environment } from '../../../../../../environments/environment.development';
import { ApiService } from '../../../../../services/api.service';
import { error } from 'console';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participant.component.html',
  styleUrl: './participant.component.scss'
})
export class ParticipantComponent implements OnInit,OnChanges{

  @Input() member:Participant
  @Input() adminFlag:boolean
  @Output() removeParticipantEvent = new EventEmitter<any>()
  @Output() makeRoomAdminEvent = new EventEmitter<any>()
  @Output() dismissAdminEvent = new EventEmitter<any>()
  memberPic:string|null
  isOptionsOpened:boolean = false
  user:string|null
  roomId:number

  constructor(private appService: AppService,private elementRef: ElementRef,private dataService: DataService){}

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit()
  }

  ngOnInit(): void {
    if(this.member.profile_pic){
      this.memberPic=this.appService.getImageUrl(this.member.profile_pic)
    }else{
      this.memberPic = environment.USER_IMAGE
    }
    if(typeof localStorage != "undefined"){
      this.user = localStorage.getItem('user')
    }
  }

  removeParticipant(){
    this.removeParticipantEvent.emit(this.member.id)
    this.toggleOptions(this.member.id)
  }
  makeRoomAdmin(){
    this.makeRoomAdminEvent.emit(this.member.id)
    this.toggleOptions(this.member.id)
  }
  dismissAdmin(){
    this.dismissAdminEvent.emit(this.member.id)
    this.toggleOptions(this.member.id)
  }
  openConvo(){
    this.dataService.notifyOther({
      view:"chat",
      data:{
        type:"user",
        id:this.member.id,
        name:this.member.name,
        profile_pic:this.member.profile_pic,
        max_modified_at:null
      }
    })
  }

  toggleOptions(userId : number){
    if(this.user){
      if(userId !== JSON.parse(this.user).id)
        this.isOptionsOpened = !this.isOptionsOpened
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOptionsOpened = false;
    }
  }

}
