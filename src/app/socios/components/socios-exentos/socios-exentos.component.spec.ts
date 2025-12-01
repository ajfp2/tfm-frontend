import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosExentosComponent } from './socios-exentos.component';

describe('SociosExentosComponent', () => {
  let component: SociosExentosComponent;
  let fixture: ComponentFixture<SociosExentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SociosExentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociosExentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
