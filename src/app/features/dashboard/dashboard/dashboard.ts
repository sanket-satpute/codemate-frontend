import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-dashboard',
  standalone: true, // Add standalone to avoid NgModule issues
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // Optional: Add a title for the page
  title = 'Dashboard';

  // Optional: Theme toggle logic can be added here later
  // constructor(private themeService: ThemeService) {}
}
