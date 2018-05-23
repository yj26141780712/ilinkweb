import { Component, OnInit,Input} from '@angular/core';

@Component({
  selector: 'navigation',
  template: `
  <div class="navigation">
    <i class="fa fa-home" aria-hidden="true"></i>
    <ul>
      <li *ngFor='let item of name'>{{item}}<i class="fa fa-angle-right" aria-hidden="true"></i></li>
    </ul>
  </div>
  `,
  styleUrls: ['./produce-list.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() name:Array<string>;
  constructor() { }

  ngOnInit() {
  }

}
