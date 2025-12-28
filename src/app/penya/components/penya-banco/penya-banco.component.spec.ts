import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenyaBancoComponent } from './penya-banco.component';

describe('PenyaBancoComponent', () => {
  let component: PenyaBancoComponent;
  let fixture: ComponentFixture<PenyaBancoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenyaBancoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenyaBancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
