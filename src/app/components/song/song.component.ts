import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {

  @Input() songData;

  constructor() { }

  ngOnInit() {
  }

}
