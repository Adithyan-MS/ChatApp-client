import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageHandlerComponent } from './image-handler.component';

describe('ImageHandlerComponent', () => {
  let component: ImageHandlerComponent;
  let fixture: ComponentFixture<ImageHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageHandlerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
