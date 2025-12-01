import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosDeudoresComponent } from './socios-deudores.component';

describe('SociosDeudoresComponent', () => {
  let component: SociosDeudoresComponent;
  let fixture: ComponentFixture<SociosDeudoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SociosDeudoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociosDeudoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
