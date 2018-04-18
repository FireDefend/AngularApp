import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorateResultsComponent } from './favorate-results.component';

describe('FavorateResultsComponent', () => {
  let component: FavorateResultsComponent;
  let fixture: ComponentFixture<FavorateResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavorateResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorateResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
