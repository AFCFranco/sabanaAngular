import { Component, OnInit, Input } from '@angular/core';
import { RecordData } from '../../classes/record-data';

@Component({
  selector: 'app-monitoring-card',
  templateUrl: './monitoring-card.component.html',
  styleUrls: ['./monitoring-card.component.css']
})
export class MonitoringCardComponent implements OnInit {

  @Input() record: RecordData;


  constructor() { }

  ngOnInit() {
    // console.log(`Reposicionamiento del registro: ${this.record.id}`);
  }


  openDialogEditAlerts() {

  }

}
