import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-podium',
  templateUrl: './podium.component.html',
  styleUrls: ['./podium.component.css']
})
export class PodiumComponent implements OnInit {

  @Input() winners;

  constructor() { }

  ngOnInit() {
  }

}
