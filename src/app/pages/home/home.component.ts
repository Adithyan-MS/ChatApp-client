import {Component, HostListener, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ShowChatComponent } from './show-chat/show-chat.component';
import { DataService } from '../../services/data-transfer/data.service';
import { NewMessagesService } from '../../services/new-messages.service';

@Component({
    selector:"app-home",
    standalone:true,
    imports:[FormsModule,SidebarComponent,ShowChatComponent],
    templateUrl: './home.component.html',
    styleUrl:'./home.component.scss'
})

export class HomeComponent implements OnInit{

    constructor(private dataService:DataService,private newMessageService: NewMessagesService){}

    ngOnInit(): void {
        this.mobileSize()
        this.dataService.notifyObservable$.subscribe((res)=>{
            if(res == "mobile-back"){
                let sidebar = document.getElementById('sidebar') as HTMLElement;
                let show = document.getElementById('show') as HTMLElement;
                sidebar?.style.setProperty('display', 'flex')
                sidebar?.style.setProperty('width', '100%')
                show?.style.setProperty('display', 'none')
                this.newMessageService.openedChat = null
            }
        })
    }

    @HostListener('window:resize', ['$event'])
    mobileSize() {
        let sidebar = document.getElementById('sidebar') as HTMLElement;
        let show = document.getElementById('show') as HTMLElement;
        if(window.innerWidth <= 500){
            sidebar?.style.setProperty('display', 'flex')
            sidebar?.style.setProperty('width', '100%')
            show?.style.setProperty('display', 'none')
        }else if(window.innerWidth <= 700){
            sidebar?.style.setProperty('display', 'flex')
            show?.style.setProperty('display', 'flex')
            sidebar?.style.setProperty('width', '45%')
            show?.style.setProperty('width', '55%')
        }else if(window.innerWidth <= 800){
            sidebar?.style.setProperty('display', 'flex')
            sidebar?.style.setProperty('width', '40%')
            show?.style.setProperty('width', '60%')
            show?.style.setProperty('display', 'flex')
        }
        else if(window.innerWidth <= 1024){
            sidebar?.style.setProperty('display', 'flex')
            sidebar?.style.setProperty('width', '30%')
            show?.style.setProperty('width', '70%')
            show?.style.setProperty('display', 'flex')
        }else{
            sidebar?.style.setProperty('display', 'flex')
            sidebar?.style.setProperty('width', '25%')
            show?.style.setProperty('width', '75%')
            show?.style.setProperty('display', 'flex')
        }
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