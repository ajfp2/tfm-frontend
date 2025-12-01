import { TestBed } from '@angular/core/testing';

import { SociosRealcionesService } from './socios-realciones.service';

describe('SociosRealcionesService', () => {
  let service: SociosRealcionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SociosRealcionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
