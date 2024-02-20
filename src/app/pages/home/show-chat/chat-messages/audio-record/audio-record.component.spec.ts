import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioRecordComponent } from './audio-record.component';

describe('AudioRecordComponent', () => {
  let component: AudioRecordComponent;
  let fixture: ComponentFixture<AudioRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
