import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvNotComponent } from './env-not.component';

describe('EnvNotComponent', () => {
  let component: EnvNotComponent;
  let fixture: ComponentFixture<EnvNotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvNotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvNotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
