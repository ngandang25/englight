import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ProfileService } from '../../profile/service/profile.service';
import { UserInfo } from '../models/user-info.model';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public user: WritableSignal<UserInfo | undefined> = signal<UserInfo | undefined>(undefined);
  constructor(
    private profileService: ProfileService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.user.set(profile);
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
