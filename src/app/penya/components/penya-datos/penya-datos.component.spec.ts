import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenyaDatosComponent } from './penya-datos.component';

describe('PenyaDatosComponent', () => {
  let component: PenyaDatosComponent;
  let fixture: ComponentFixture<PenyaDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenyaDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenyaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
