import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosListComponent } from './contactos-list.component';

describe('ContactosListComponent', () => {
  let component: ContactosListComponent;
  let fixture: ComponentFixture<ContactosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
