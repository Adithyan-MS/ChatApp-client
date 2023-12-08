import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewContentComponent } from './profile-view-content.component';

describe('ProfileViewContentComponent', () => {
  let component: ProfileViewContentComponent;
  let fixture: ComponentFixture<ProfileViewContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileViewContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileViewContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
