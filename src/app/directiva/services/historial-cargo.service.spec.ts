import { TestBed } from '@angular/core/testing';

import { HistorialCargoService } from './historial-cargo.service';

describe('HistorialCargoService', () => {
  let service: HistorialCargoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialCargoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
