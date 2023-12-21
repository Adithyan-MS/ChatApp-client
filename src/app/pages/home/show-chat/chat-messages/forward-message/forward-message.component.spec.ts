import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardMessageComponent } from './forward-message.component';

describe('ForwardMessageComponent', () => {
  let component: ForwardMessageComponent;
  let fixture: ComponentFixture<ForwardMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForwardMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForwardMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
