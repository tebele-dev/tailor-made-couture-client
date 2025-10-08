import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDesignComponent } from './custom-design-master.component';

describe('CustomDesignComponent', () => {
  let component: CustomDesignComponent;
  let fixture: ComponentFixture<CustomDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDesignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});