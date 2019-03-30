import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pressure-map-icon',
  templateUrl: './pressure-map-icon.component.html',
  styleUrls: ['./pressure-map-icon.component.css']
})
export class PressureMapIconComponent implements OnInit {

  active_color: string;

  @Input() region: string;

  constructor() {
    this.active_color = '#5CB5E3';
  }

  ngOnInit() {
  }

  regionStyle(region) {
    const active_style = {
      'fill': (this.active_color) ? this.active_color : 'blue',
      'fill-opacity': '1',
      'stroke': (this.active_color) ? this.active_color : 'blue'
      };
    const incative_style = {
      'fill': 'lightslategray',
      'fill-opacity': '1',
      'stroke': 'lightslategray'
      };
    if (region === this.region) {
      return active_style;
    }
    return incative_style;
  }

}
