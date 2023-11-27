import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { error } from 'console';
import { Observable } from 'rxjs';

@Component({
    selector:"app-home",
    standalone:true,
    imports:[FormsModule],
    templateUrl: './home.component.html',
    styleUrl:'./home.component.scss'
})

export class HomeComponent implements OnInit{

    constructor(private api: ApiService){
    }

    ngOnInit(): void {

    }
}