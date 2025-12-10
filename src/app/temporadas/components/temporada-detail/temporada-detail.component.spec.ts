import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporadaDetailComponent } from './temporada-detail.component';

describe('TemporadaDetailComponent', () => {
  let component: TemporadaDetailComponent;
  let fixture: ComponentFixture<TemporadaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporadaDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporadaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
