import { Component } from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconModule,
    MatMenuModule,
    MatIconButton
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {

}
