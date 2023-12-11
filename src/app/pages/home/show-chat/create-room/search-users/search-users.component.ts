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

  constructor(private api:ApiService){}

  searchUsers(event:any){
    let searchName = event.target.value
    if(searchName !== ""){
      let queryParams = new HttpParams()
      queryParams = queryParams.append("name",searchName)
      this.api.getReturn(`${environment.BASE_API_URL}/user/searchUsers`,{params:queryParams}).subscribe((data)=>{
        console.log(data);
        this.searchResult = data
      },(error)=>{
        console.log(error);
      })
    }else{
      this.searchResult=null
    }
  }
}
