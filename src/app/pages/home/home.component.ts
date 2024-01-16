import {Component, HostListener, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ShowChatComponent } from './show-chat/show-chat.component';
import { DataService } from '../../services/data.service';

@Component({
    selector:"app-home",
    standalone:true,
    imports:[FormsModule,SidebarComponent,ShowChatComponent],
    templateUrl: './home.component.html',
    styleUrl:'./home.component.scss'
})

export class HomeComponent implements OnInit{

    constructor(private dataService:DataService){}

    ngOnInit(): void {
        this.dataService.notifyObservable$.subscribe((res)=>{
            if(res == "mobile-back"){
                let sidebar = document.getElementById('sidebar') as HTMLElement;
                let show = document.getElementById('show') as HTMLElement;
                sidebar?.style.setProperty('display', 'flex')
                sidebar?.style.setProperty('width', '100%')
                show?.style.setProperty('display', 'none')
            }
        })
    }

    onMobileView(event:boolean){
        let sidebar = document.getElementById('sidebar') as HTMLElement;
        let show = document.getElementById('show') as HTMLElement;
        if(event){
            show?.style.setProperty('display', 'flex')
            show?.style.setProperty('width', '100%')
            sidebar?.style.setProperty('display', 'none')
        }
    }

}