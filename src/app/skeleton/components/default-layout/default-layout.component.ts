import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet],
  templateUrl: './default-layout.component.html',
  standalone: true,
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {

}
