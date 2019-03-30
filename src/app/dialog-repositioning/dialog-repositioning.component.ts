import { Component, OnInit, OnDestroy, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SilhouetteData } from '../classes/silhouette-data';
import { AlarmSetpoint } from '../alarm-setpoint';

@Component({
  selector: 'app-dialog-repositioning',
  templateUrl: './dialog-repositioning.component.html',
  styleUrls: ['./dialog-repositioning.component.css']
})
export class DialogRepositioningComponent implements OnInit, AfterViewInit, OnDestroy {

  s1_selection = 0;

  isEnableConditionTextArea = false;

  isSensibilityDivEnable = false;

  public silhouetteChoices = [
    { value: 'DS', viewValue: 'DECUBITO SUPINO' },
    { value: 'DP', viewValue: 'DECUBITO PRONO' },
    { value: 'DLI', viewValue: 'DECUBITO LAT IZQ' },
    { value: 'DLD', viewValue: 'DECUBITO LAT DER' },
  ];

  public sensibilitiesChoices = [
    { value: 4, viewValue: '5' },
    { value: 3, viewValue: '4' },
    { value: 2, viewValue: '3' },
    { value: 1, viewValue: '2' },
    { value: 0, viewValue: '1' },
  ];

  last_sensibilities: any;

  public elapsedTimeChoices = [
    { value: 1, viewValue: '1 min' },
    { value: 5, viewValue: '5 min' },
    { value: 15, viewValue: '15 min' },
    { value: 30, viewValue: '30 min' },
    { value: 45, viewValue: '45 min' },
    { value: 60, viewValue: '60 min' },
    { value: 75, viewValue: '75 min' },
  ];
  last_elapsed_time: any;

  public myForm: FormGroup;
  public title = 'Ubicación del paciente';
  public subtitle = 'Por favor seleccione la posición del paciente a partir de la cual se iniciará  el monitoreo';

  constructor(
    public dialogRef: MatDialogRef<DialogRepositioningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { record: number, silhouette: string, alarms_setpoints: AlarmSetpoint[],
      isEnableCondition: boolean, condition: string},
    private formBuilder: FormBuilder
    ) {
    // this.isEnableConditionTextArea = data.isEnableCondition;
    // this.myForm.patchValue({ 'silhouette': this.data.silhouette });
    this.myForm = formBuilder.group({
      'condition': [{value: data.condition, disabled: !data.isEnableCondition}],
      'silhouette': [data.silhouette, Validators.required],
      'sr1': [data.alarms_setpoints.filter((alarmSetpoint: AlarmSetpoint) => alarmSetpoint.region === 'R1')[0].sensibility,
       Validators.required],
      'sr2': [data.alarms_setpoints.filter((alarmSetpoint: AlarmSetpoint) => alarmSetpoint.region === 'R2')[0].sensibility,
      Validators.required],
      'sr3': [data.alarms_setpoints.filter((alarmSetpoint: AlarmSetpoint) => alarmSetpoint.region === 'R3')[0].sensibility,
        Validators.required],
      'sr4': [data.alarms_setpoints.filter((alarmSetpoint: AlarmSetpoint) => alarmSetpoint.region === 'R4')[0].sensibility,
        Validators.required],
      'sr5': [data.alarms_setpoints.filter((alarmSetpoint: AlarmSetpoint) => alarmSetpoint.region === 'R5')[0].sensibility,
        Validators.required],
      'et1': [data.alarms_setpoints.filter((alarmSetpoint: AlarmSetpoint) => alarmSetpoint.region === 'R1')[0].minutes,
        Validators.required],
      'et2': [data.alarms_setpoints.filter((alarmSetpoint: AlarmSetpoint) => alarmSetpoint.region === 'R2')[0].minutes,
        Validators.required],
      'et3': [data.alarms_setpoints.filter((alarmSetpoint: AlarmSetpoint) => alarmSetpoint.region === 'R3')[0].minutes,
        Validators.required],
      'et4': [data.alarms_setpoints.filter((alarmSetpoint: AlarmSetpoint) => alarmSetpoint.region === 'R4')[0].minutes,
        Validators.required],
      'et5': [data.alarms_setpoints.filter((alarmSetpoint: AlarmSetpoint) => alarmSetpoint.region === 'R5')[0].minutes,
        Validators.required],
    });
  }

  startRepositioning() {
    if (this.myForm.valid) {
      this.dialogRef.close({
        record: this.data.record,
        silhouette: this.myForm.get('silhouette').value,
        alarms_setpoints: [
          {
            region: 'R1',
            sensibility: this.myForm.get('sr1').value,
            minutes: this.myForm.get('et1').value
          },
          {
            region: 'R2',
            sensibility: this.myForm.get('sr2').value,
            minutes: this.myForm.get('et2').value
          },
          {
            region: 'R3',
            sensibility: this.myForm.get('sr3').value,
            minutes: this.myForm.get('et3').value
          },
          {
            region: 'R4',
            sensibility: this.myForm.get('sr4').value,
            minutes: this.myForm.get('et4').value
          },
          {
            region: 'R5',
            sensibility: this.myForm.get('sr5').value,
            minutes: this.myForm.get('et5').value
          },
        ],
        condition: this.myForm.get('condition').value
      });
    } else {
      // this.myForm.
      // this.dialogRef.close();
    }
  }

  onOutsideClick(): void {
    this.dialogRef.close();
  }
  onSave() {
    this.startRepositioning();
    // if (this.myForm.valid) {
    // } else {
    //   // console.log('Form not Submitted!');
    // }
  }

  showSensibilityDiv() {
    this.isSensibilityDivEnable = !this.isSensibilityDivEnable;
  }

  ngOnInit() {
  }



  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

}
