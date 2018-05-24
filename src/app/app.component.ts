import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  // @HostListener('window:resize', ['event'])
  // onresize() {
  //   console.log(333);
  // }
}
