import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDesignDetailComponent } from './custom-design-detail.component';

describe('CustomDesignDetailComponent', () => {
  let component: CustomDesignDetailComponent;
  let fixture: ComponentFixture<CustomDesignDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDesignDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDesignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
