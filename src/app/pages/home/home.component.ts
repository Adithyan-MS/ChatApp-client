import {Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ShowChatComponent } from './show-chat/show-chat.component';

@Component({
    selector:"app-home",
    standalone:true,
    imports:[FormsModule,SidebarComponent,ShowChatComponent],
    templateUrl: './home.component.html',
    styleUrl:'./home.component.scss'
})

export class HomeComponent{
}