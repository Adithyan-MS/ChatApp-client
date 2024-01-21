import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements OnInit{
  
  // @Input() title: string;
  // @Input() message: string;
  // @Input() btnOkText: string;
  // @Input() btnCancelText: string;

  // constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  // public decline() {
  //   this.activeModal.close(false);
  // }

  // public accept() {
  //   this.activeModal.close(true);
  // }

  // public dismiss() {
  //   this.activeModal.dismiss();
  // }

}
