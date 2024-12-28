import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutUsersComponent } from './ajout-users.component';

describe('AjoutUsersComponent', () => {
  let component: AjoutUsersComponent;
  let fixture: ComponentFixture<AjoutUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
