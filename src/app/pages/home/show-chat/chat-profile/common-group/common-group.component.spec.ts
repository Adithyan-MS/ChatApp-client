import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonGroupComponent } from './common-group.component';

describe('CommonGroupComponent', () => {
  let component: CommonGroupComponent;
  let fixture: ComponentFixture<CommonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
