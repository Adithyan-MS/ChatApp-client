import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchUsersComponent } from './search-users/search-users.component';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment.development';
import { userSearch } from '../../../models/data-types';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-add-room-member',
  standalone: true,
  imports: [CommonModule,SearchUsersComponent],
  templateUrl: './add-room-member.component.html',
  styleUrl: './add-room-member.component.scss'
})
export class AddRoomMemberComponent implements OnInit{

  @Input() roomId: number
  members:number[]
  @Output() successEvent = new EventEmitter<any>()

  constructor(private apiService: ApiService, private dataService: DataService){}
  
  ngOnInit(): void {
    
  }

  onSubmit(){
    const reqBody = {
      members: this.members
    }
    const headers = new HttpHeaders().set("ResponseType","text")
    this.apiService.postReturn(`${environment.BASE_API_URL}/room/${this.roomId}/addMember`,reqBody,{headers}).subscribe((data)=>{
      this.successEvent.emit(data) 
      this.dataService.notifyOther("newMembersAdded")
    },(error)=>{
      console.log(error);      
    })
  }

  onItemsChanged(value:userSearch[]){
    this.members = value.map(obj => obj.id)
  }
}
