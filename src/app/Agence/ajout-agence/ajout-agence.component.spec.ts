import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutAgenceComponent } from './ajout-agence.component';

describe('AjoutAgenceComponent', () => {
  let component: AjoutAgenceComponent;
  let fixture: ComponentFixture<AjoutAgenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutAgenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutAgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
