import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';
import { error } from 'console';

@Component({
    selector:"app-home",
    standalone:true,
    imports:[FormsModule],
    templateUrl: './home.component.html',
    styleUrl:'./home.component.scss'
})

export class HomeComponent implements OnInit{

    constructor(private api: ApiService){

        const apiUrl = `http://localhost:8080/chatApi/v1/user/all`
    
        this.api.getReturn(apiUrl).subscribe((data)=>{
            console.log(data);
        },(error)=>{
            console.log(error);
            
        })
    }

    ngOnInit(): void {

    }

    
    posts:Array<string> = ["p1,p2,p3,p4,p5"]
}