import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, Toast],
  templateUrl: './default-layout.component.html',
  standalone: true,
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {

}
