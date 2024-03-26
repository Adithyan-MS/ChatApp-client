import { TestBed } from '@angular/core/testing';

import { NewMessagesService } from './new-messages.service';

describe('NewMessagesService', () => {
  let service: NewMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
