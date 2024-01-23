import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule,ClipboardModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent {

  @Input() message: string;
  @Input() title: string;
  isCopied: boolean = false;
  @Output() closeEvent = new EventEmitter<any>()

  ngOnInit() {

  }

  close() {
    this.closeEvent.emit(true)
  }

}
