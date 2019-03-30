import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { SabanaAndRecordData } from '../../classes/sabana-and-record-data';
import { PatientData } from '../../classes/patient-data';
import { WebSocketService } from '../../services/websocket.service';
import { PatientsService } from '../../services/patients.service';
import { BirthdayValidator } from '../../classes/birthday-validator';

@Component({
  selector: 'app-sabanas-details',
  templateUrl: './sabanas-details.component.html',
  styleUrls: ['./sabanas-details.component.css']
})
export class SabanasDetailsComponent implements OnInit {

  @Input() sabanaAndRecordData: SabanaAndRecordData;
  @Input() parentSabanasComponent: any;

  public myForm: FormGroup;

  public isFormGroupEnabled = false;

  genderOptions = [
    { value: 'M', viewValue: 'Masculino' },
    { value: 'F', viewValue: 'Femenino' },
  ];

  public doctypeOptions = [
    { value: 'CC', viewValue: 'C. ciudadanía' },
    { value: 'CE', viewValue: 'C. extrangería' },
    { value: 'TI', viewValue: 'T. identidad' },
  ];


  public silhouetteOptions = [
    { value: 'DS', viewValue: 'Decúbito supino' },
    { value: 'DP', viewValue: 'Decúbito prono' },
    { value: 'DLI', viewValue: 'Decúbito lat izq.' },
    { value: 'DLD', viewValue: 'Decúbito lat der.' },
  ];


  isLoadingPatient = false;

  filteredPatients: PatientData[] = [];

  constructor(private wsService: WebSocketService, private formBuilder: FormBuilder,
    private patientsService: PatientsService) {
    this.myForm = formBuilder.group({
      'first_name': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      'last_name': [null, Validators.compose([Validators.minLength(5), Validators.maxLength(90)])],
      'address': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(120)])],
      'gender': [null, Validators.required],
      'doc_type': [null, Validators.required],
      // 'silhouette': [null, Validators.required],
      'n_document': [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(10)])],
      'email': [null, Validators.compose([Validators.required, , Validators.email])],
      'birthday': [null, Validators.compose([Validators.required, BirthdayValidator.birthdayValidator])],
      'condition': [null, Validators.compose([Validators.maxLength(150)])],
      'height': [null, Validators.compose([Validators.required, Validators.maxLength(3)])],
      'weight': [null, Validators.compose([Validators.required, Validators.maxLength(6)])],
    });
  }

  ngOnInit() {
    this.loadFormGroupData();
    this.myForm.get('n_document')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoadingPatient = true),
        switchMap(value => this.patientsService.findPatients(10, 0, 'desc', value == null ? '' : value)
          .pipe(
            finalize(() => this.isLoadingPatient = false)
          )
        )
      ).subscribe((patients: PatientData[]) => this.filteredPatients = patients);
    this.obtainSubscriptions();
  }

  public obtainSubscriptions() {
    this.wsService.connect().subscribe(msg => msg);
    this.wsService.createRecordObs.subscribe(msg => {
      if (msg === true) {
        this.wsService.createRecordBehaviorSubject.next(false);
        this.parentSabanasComponent.loadSabanasAndRecords();
      }
    });
  }

  loadFormGroupData() {
    if (this.sabanaAndRecordData.record !== undefined && this.sabanaAndRecordData.record !== null) {
      this.myForm.patchValue({
        'first_name': this.sabanaAndRecordData.record.patient.first_name
          !== undefined ? this.sabanaAndRecordData.record.patient.first_name : null
      });
      this.myForm.patchValue({
        'last_name': this.sabanaAndRecordData.record.patient.last_name
          !== undefined ? this.sabanaAndRecordData.record.patient.last_name : null
      });
      this.myForm.patchValue({
        'address': this.sabanaAndRecordData.record.patient.address
          !== undefined ? this.sabanaAndRecordData.record.patient.address : null
      });
      this.myForm.patchValue({
        'gender': this.sabanaAndRecordData.record.patient.gender
          !== undefined ? this.sabanaAndRecordData.record.patient.gender : null
      });
      this.myForm.patchValue({
        'doc_type': this.sabanaAndRecordData.record.patient.doc_type
          !== undefined ? this.sabanaAndRecordData.record.patient.doc_type : null
      });
      this.myForm.patchValue({
        'n_document': this.sabanaAndRecordData.record.patient.n_document
          !== undefined ? this.sabanaAndRecordData.record.patient.n_document : null
      });
      this.myForm.patchValue({
        'email': this.sabanaAndRecordData.record.patient.email
          !== undefined ? this.sabanaAndRecordData.record.patient.email : null
      });
      this.myForm.patchValue({
        'birthday': this.sabanaAndRecordData.record.patient.birthday
          !== undefined ? this.sabanaAndRecordData.record.patient.birthday : null
      });
      
      // this.myForm.patchValue({
      //   'silhouette': this.sabanaAndRecordData.silhouette.name
      //     !== undefined ? this.sabanaAndRecordData.silhouette.name : null
      // });
      this.myForm.patchValue({
        'weight': this.sabanaAndRecordData.record.patient.weight
          !== undefined ? this.sabanaAndRecordData.record.patient.weight : null
      });
      this.myForm.patchValue({
        'height': this.sabanaAndRecordData.record.patient.height
          !== undefined ? this.sabanaAndRecordData.record.patient.height : null
      });
      this.disableFormGroup();
    } else {
      this.myForm.patchValue({ 'first_name': null });
      this.myForm.patchValue({ 'last_name': null });
      this.myForm.patchValue({ 'address': null });
      this.myForm.patchValue({ 'gender': null });
      this.myForm.patchValue({ 'heght': null });
      this.myForm.patchValue({ 'weight': null });
      this.myForm.patchValue({ 'doc_type': null });
      this.myForm.patchValue({ 'n_document': null });
      this.myForm.patchValue({ 'email': null });
      this.myForm.patchValue({ 'birthday': null });
      // this.myForm.patchValue({ 'silhouette': null });
      this.enableFormGroup();
    }

  }

  disableFormGroup() {
    this.myForm.get('first_name').disable();
    this.myForm.get('last_name').disable();
    this.myForm.get('address').disable();
    this.myForm.get('gender').disable();
    this.myForm.get('height').disable();
    this.myForm.get('weight').disable();
    this.myForm.get('doc_type').disable();
    this.myForm.get('n_document').disable();
    this.myForm.get('email').disable();
    this.myForm.get('birthday').disable();
    // this.myForm.get('silhouette').disable();
    this.isFormGroupEnabled = false;
  }

  enableFormGroup() {
    this.myForm.get('first_name').enable();
    this.myForm.get('last_name').enable();
    this.myForm.get('address').enable();
    this.myForm.get('gender').enable();
    this.myForm.get('height').enable();
    this.myForm.get('weight').enable();
    this.myForm.get('doc_type').enable();
    this.myForm.get('n_document').enable();
    this.myForm.get('email').enable();
    this.myForm.get('birthday').enable();
    // this.myForm.get('silhouette').enable();
    this.isFormGroupEnabled = true;
  }

  onSave() {
    if (this.myForm.valid) {
    } else {
      // console.log('Form not Submitted!');
    }
  }


  createRecord() {
    if (this.myForm.valid) {
      if (confirm('¿Desea realmente crear un registro con con los detalles del paciente?')) {
        this.wsService.send({
          'msg_type': 'request',
          'request': 'create_record',
          'details': {
            'sabana': this.sabanaAndRecordData.sabana.id,
            'patient': <PatientData>this.myForm.value,
            // 'silhouette': this.myForm.get('silhouette').value
          }
        });
        // this.parentPatientComponent.patientsService.deletePatient(this.patientData.id)
        // .pipe(
        //   catchError(() => of([])),
        // ).subscribe(() => this.parentPatientComponent.loadPatientsPage());
      }
    } else {
      // console.log('Form not Submitted!');
    }
  }



  setPatient(patient: PatientData) {
    if (patient) {
      this.myForm.patchValue({ 'first_name': patient.first_name });
      this.myForm.patchValue({ 'last_name': patient.last_name });
      this.myForm.patchValue({ 'address': patient.address });
      this.myForm.patchValue({ 'gender': patient.gender });
      this.myForm.patchValue({ 'weight': patient.weight });
      this.myForm.patchValue({ 'height': patient.height });
      this.myForm.patchValue({ 'doc_type': patient.doc_type });
      // this.myForm.patchValue({'n_document': patient.n_document});
      this.myForm.patchValue({ 'email': patient.email });
      this.myForm.patchValue({ 'birthday': patient.birthday });
    }
  }

  displayFn(n_document: number) {
    if (n_document) {
      return n_document;
    }
  }

}
