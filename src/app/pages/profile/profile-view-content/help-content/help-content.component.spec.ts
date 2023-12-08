import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpContentComponent } from './help-content.component';

describe('HelpContentComponent', () => {
  let component: HelpContentComponent;
  let fixture: ComponentFixture<HelpContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
