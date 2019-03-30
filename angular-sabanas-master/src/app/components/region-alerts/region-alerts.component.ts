import { Component, OnInit, Input } from '@angular/core';
import { RegionAlertData } from '../../classes/region-alert-data';

@Component({
  selector: 'app-region-alerts',
  templateUrl: './region-alerts.component.html',
  styleUrls: ['./region-alerts.component.css']
})
export class RegionAlertsComponent implements OnInit {

  @Input() region_name: string;
  @Input() region_alert: RegionAlertData;
  constructor() { }

  ngOnInit() {
  }

}
