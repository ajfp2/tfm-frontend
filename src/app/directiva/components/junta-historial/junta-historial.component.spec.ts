import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuntaHistorialComponent } from './junta-historial.component';

describe('JuntaHistorialComponent', () => {
  let component: JuntaHistorialComponent;
  let fixture: ComponentFixture<JuntaHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuntaHistorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuntaHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
