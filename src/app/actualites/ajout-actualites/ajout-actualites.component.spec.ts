import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutActualitesComponent } from './ajout-actualites.component';

describe('AjoutActualitesComponent', () => {
  let component: AjoutActualitesComponent;
  let fixture: ComponentFixture<AjoutActualitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutActualitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutActualitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
