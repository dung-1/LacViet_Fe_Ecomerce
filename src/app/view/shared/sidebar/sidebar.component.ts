import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
    // window.location.reload();
  }

  isActive(path: string): boolean {
    return this.router.isActive(path, true);
  }
}