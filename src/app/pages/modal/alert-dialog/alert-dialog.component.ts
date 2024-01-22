import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent {

  @Input() message: string;
  @Output() closeEvent = new EventEmitter<any>()

  ngOnInit() {
  }

  close() {
    this.closeEvent.emit(true)
  }

}
