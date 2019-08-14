import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @Input() percent = 0;
  @Input() guessed = false;
  @Input() isWaiting;

  constructor() { }

  ngOnInit() {
  }

  formatOne = (percent: number) =>
    this.isWaiting ? `${Math.abs(4 - ((percent / 100) * 4)).toFixed(0)}` : `${Math.abs(30 - ((percent / 100) * 30)).toFixed(0)}`

}
