import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor() { }

  getDropdownAnimation() {
    return trigger('dropdownAnimation', [
      state('void', style({ transform: 'translateY(-10%)', opacity: 0 })),
      transition(':enter, :leave', [
        animate('150ms ease-in-out'),
      ]),
    ]);
  }

  getDropupAnimation() {
    return trigger('dropupAnimation', [
      state('void', style({ transform: 'translateY(10%)', opacity: 0 })),
      transition(':enter, :leave', [
        animate('150ms ease-in-out'),
      ]),
    ]);
  }

  getFadeInOutAnimation() {
    return trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('100ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]);
  }

  getListReorderAnimation() {
    return trigger('listReorder', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({ opacity: 0, transform: 'translateY(10%)' }),
        ], { optional: true }),
        query(':enter', [
          stagger('100ms', [
            animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
        query(':leave', [
          stagger('100ms', [
            animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateY(10%)' })),
          ]),
        ], { optional: true }),
      ]),
    ]);
  }

  getItemMovementAnimation() {
    return trigger('itemMovement', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10%)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateY(10%)' })),
      ]),
    ]);
  }
  
  getVerticalMovementAnimation() {
    return trigger('verticalMovement', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(-10%)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]);
  }

  getPopupAnimation() {
    return trigger('popupAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]);
  }
}
