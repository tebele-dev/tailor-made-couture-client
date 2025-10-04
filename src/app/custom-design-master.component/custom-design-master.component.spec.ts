import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDesignMasterComponent } from './custom-design-master.component';

describe('CustomDesignMasterComponent', () => {
  let component: CustomDesignMasterComponent;
  let fixture: ComponentFixture<CustomDesignMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDesignMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDesignMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
