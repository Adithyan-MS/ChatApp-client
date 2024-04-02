import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './general/general.component';
import { AccountComponent } from './account/account.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PersonalizationComponent } from './personalization/personalization.component';
import { ChatsComponent } from './chats/chats.component';
import { StorageComponent } from './storage/storage.component';
import { HelpContentComponent } from './help-content/help-content.component';
import { DataService } from '../../../services/data-transfer/data.service';

@Component({
  selector: 'app-profile-view-content',
  standalone: true,
  imports: [CommonModule,GeneralComponent,AccountComponent,NotificationsComponent,PersonalizationComponent,ChatsComponent,StorageComponent,HelpContentComponent],
  templateUrl: './profile-view-content.component.html',
  styleUrl: './profile-view-content.component.scss'
})
export class ProfileViewContentComponent implements OnInit{

  menu:string

  constructor(private dataService:DataService){}

  ngOnInit(): void {
    this.dataService.notifyObservable$.subscribe(res=>{
      if(res){
        this.menu=res        
      }
    })
  }


}
