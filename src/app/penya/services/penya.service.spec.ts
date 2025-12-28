import { TestBed } from '@angular/core/testing';

import { PenyaService } from './penya.service';

describe('PenyaService', () => {
  let service: PenyaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PenyaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
