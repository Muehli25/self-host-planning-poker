import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-start-page',
  standalone: true,
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartPageComponent {

}
