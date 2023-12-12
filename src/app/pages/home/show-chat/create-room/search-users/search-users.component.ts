import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../services/api.service';
import { environment } from '../../../../../../environments/environment.development';
import { User } from '../../../../../models/data-types';
import { HttpParams } from '@angular/common/http';
import { UserResultComponent } from './user-result/user-result.component';

@Component({
  selector: 'app-search-users',
  standalone: true,
  imports: [CommonModule,UserResultComponent],
  templateUrl: './search-users.component.html',
  styleUrl: './search-users.component.scss'
})
export class SearchUsersComponent {

  searchResult:User[]|null
  selectedUsers:any[]=[]

  constructor(private api:ApiService){}

  searchUsers(event:any){
    let searchName = event.target.value
    if(searchName !== ""){
      let queryParams = new HttpParams()
      queryParams = queryParams.append("name",searchName)
      this.api.getReturn(`${environment.BASE_API_URL}/user/searchUsers`,{params:queryParams}).subscribe((data)=>{
        this.searchResult = data.filter((obj1:any) => !this.selectedUsers.some((obj2) => obj1.id === obj2.id));
      },(error)=>{
        console.log(error);
      })
    }else{
      this.selectedUsers =this.selectedUsers
      this.searchResult=null
    }
  }

  getSelectedUser(user:any) {
    this.selectedUsers.push(user)
    console.log(this.selectedUsers);    
  }

  isUserSelected(user:any){
    if(this.selectedUsers.includes(user)){
      return false;
    }else{
      return true;
    }
  }

  removeUser(user:any){
    this.selectedUsers = this.selectedUsers.filter(obj => {
      return obj !== user
    });
  }

}
