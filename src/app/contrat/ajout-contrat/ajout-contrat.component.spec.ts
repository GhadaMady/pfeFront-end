import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutContratComponent } from './ajout-contrat.component';

describe('AjoutContratComponent', () => {
  let component: AjoutContratComponent;
  let fixture: ComponentFixture<AjoutContratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutContratComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutContratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
