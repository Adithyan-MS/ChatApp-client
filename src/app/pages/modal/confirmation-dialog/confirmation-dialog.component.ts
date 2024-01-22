import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements OnInit{
  
  @Input() title: string;
  @Input() message: string;
  @Output() confirmEvent = new EventEmitter<any>()
  @Output() cancelEvent = new EventEmitter<any>()

  ngOnInit() {
  }

  confirm() {
    this.confirmEvent.emit(true)
  }
  
  cancel() {
    this.cancelEvent.emit(false)
  }

}
