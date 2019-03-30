import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-silhouette',
  templateUrl: './silhouette.component.html',
  styleUrls: ['./silhouette.component.css']
})
export class SilhouetteComponent implements OnInit {

  @Input() silhouette: string;

  constructor() {
    console.log(`valor: ${this.silhouette}`);
  }

  ngOnInit() {
  }

}
