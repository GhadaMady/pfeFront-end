import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeUsersComponent } from './demande-users.component';

describe('DemandeUsersComponent', () => {
  let component: DemandeUsersComponent;
  let fixture: ComponentFixture<DemandeUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
