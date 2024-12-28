import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterPaimentComponent } from './ajouter-paiment.component';

describe('AjouterPaimentComponent', () => {
  let component: AjouterPaimentComponent;
  let fixture: ComponentFixture<AjouterPaimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterPaimentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterPaimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
