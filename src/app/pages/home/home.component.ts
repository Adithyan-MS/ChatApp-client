import {Component} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector:"app-home",
    standalone:true,
    imports:[FormsModule],
    templateUrl: './home.component.html',
    styleUrl:'./home.component.scss'
})

export class HomeComponent{
    posts:Array<string> = ["p1,p2,p3,p4,p5"]
   }