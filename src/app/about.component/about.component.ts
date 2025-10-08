import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Scissors, Heart, Award, Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-angular';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  // Icons for template use
  scissorsIcon = Scissors;
  heartIcon = Heart;
  awardIcon = Award;
  instagramIcon = Instagram;
  facebookIcon = Facebook;
  twitterIcon = Twitter;
  linkedinIcon = Linkedin;
  youtubeIcon = Youtube;
} 
