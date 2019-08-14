import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {

  @Input() playerRank;
  @Input() playerData;

  constructor() { }

  ngOnInit() {
  }

}
