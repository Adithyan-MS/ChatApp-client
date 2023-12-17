import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoomMemberComponent } from './add-room-member.component';

describe('AddRoomMemberComponent', () => {
  let component: AddRoomMemberComponent;
  let fixture: ComponentFixture<AddRoomMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoomMemberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRoomMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
