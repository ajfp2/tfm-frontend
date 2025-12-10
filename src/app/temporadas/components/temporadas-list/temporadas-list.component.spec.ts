import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporadasListComponent } from './temporadas-list.component';

describe('TemporadasListComponent', () => {
  let component: TemporadasListComponent;
  let fixture: ComponentFixture<TemporadasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporadasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporadasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
