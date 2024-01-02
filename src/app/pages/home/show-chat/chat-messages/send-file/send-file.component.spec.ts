import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFileComponent } from './send-file.component';

describe('SendFileComponent', () => {
  let component: SendFileComponent;
  let fixture: ComponentFixture<SendFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
