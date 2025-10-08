import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-everyview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="everyview-container">
      <h1>Everyview Dashboard</h1>
      <p>Overview of all activities and metrics.</p>
    </div>
  `,
  styleUrls: ['./everyview.component.scss']
})
export class EveryviewComponent {
  constructor() { }
}