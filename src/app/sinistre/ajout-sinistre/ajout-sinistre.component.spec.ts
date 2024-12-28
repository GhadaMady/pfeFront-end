import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutSinistreComponent } from './ajout-sinistre.component';

describe('AjoutSinistreComponent', () => {
  let component: AjoutSinistreComponent;
  let fixture: ComponentFixture<AjoutSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutSinistreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
