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

    onMobileView(event:boolean){
        let sidebar = document.getElementById('sidebar') as HTMLElement;
        let show = document.getElementById('show') as HTMLElement;
        if(event){
            sidebar?.style.setProperty('display', 'none')
            show?.style.setProperty('width', '100%')
            show?.style.setProperty('display', 'flex')
        }else{
            sidebar?.style.setProperty('display', 'flex')
            // show?.style.setProperty('width', '100%')
            show?.style.setProperty('display', 'flex')
        }
    }
}