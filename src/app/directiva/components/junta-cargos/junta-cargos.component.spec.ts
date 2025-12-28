import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuntaCargosComponent } from './junta-cargos.component';

describe('JuntaCargosComponent', () => {
  let component: JuntaCargosComponent;
  let fixture: ComponentFixture<JuntaCargosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuntaCargosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuntaCargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
