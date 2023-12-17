import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participant, userSearch } from '../../../../models/data-types';
import { ApiService } from '../../../../services/api.service';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { UserResultComponent } from './user-result/user-result.component';

@Component({
  selector: 'app-search-users',
  standalone: true,
  imports: [CommonModule,UserResultComponent],
  templateUrl: './search-users.component.html',
  styleUrl: './search-users.component.scss'
})
export class SearchUsersComponent implements OnInit{
  
  @Output() itemsChanged = new EventEmitter<any[]>()
  @Input() roomId:number

  searchResult:userSearch[]|null
  selectedUsers:userSearch[]=[]
  roomParticipants:Participant[]

  constructor(private api:ApiService){}
  
  ngOnInit(): void {
    this.api.getReturn(`${environment.BASE_API_URL}/room/${this.roomId}/participants`).subscribe((data:Participant[])=>{
      this.roomParticipants = data
      console.log(this.roomParticipants);
      
    })
  }

  searchUsers(event:any){
    let searchName = event.target.value
    if(searchName !== ""){
      let queryParams = new HttpParams()
      queryParams = queryParams.append("name",searchName)
      this.api.getReturn(`${environment.BASE_API_URL}/user/searchUsers`,{params:queryParams}).subscribe((data)=>{
        this.searchResult = data.filter((obj1:any) => !this.selectedUsers.some((obj2) => obj1.id === obj2.id));
        this.searchResult = data.filter((obj1:any) => !this.roomParticipants.some((obj2) => obj1.id === obj2.id));
      },(error)=>{
        console.log(error);
      })
    }else{
      this.searchResult=null
    }
  }

  getSelectedUser(user:userSearch) {
    this.selectedUsers.push(user)
    this.itemsChanged.emit(this.selectedUsers)   
  }
  
  isUserSelected(user:userSearch){
    if(this.selectedUsers.includes(user)){
      return false;
    }else{
      return true;
    }
  }
  
  removeUser(user:userSearch){
    this.selectedUsers = this.selectedUsers.filter(obj => {
      return obj !== user
    });
    this.itemsChanged.emit(this.selectedUsers)   
  }
}
