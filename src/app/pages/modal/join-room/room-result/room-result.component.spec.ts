import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomResultComponent } from './room-result.component';

describe('RoomResultComponent', () => {
  let component: RoomResultComponent;
  let fixture: ComponentFixture<RoomResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
