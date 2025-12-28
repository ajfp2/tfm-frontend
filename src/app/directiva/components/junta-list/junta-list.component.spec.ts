import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuntaListComponent } from './junta-list.component';

describe('JuntaListComponent', () => {
  let component: JuntaListComponent;
  let fixture: ComponentFixture<JuntaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuntaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuntaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
