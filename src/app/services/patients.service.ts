import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PatientData } from '../classes/patient-data';
import { URL_ROOT } from '../url-root';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  readonly PATIENTS_ROOT = '/api/monitoring/patients';
  url_root = URL_ROOT;
  public patientsCount = 0;

  constructor(private httpClient: HttpClient) { }

  findPatients(limit: number = 10, offset: number = 0, n_document_dir: string = '', n_document: number = -1,
  start_date: string = '', finish_date: string = ''): Observable<PatientData[]> {
    return this.httpClient.get(this.url_root + this.PATIENTS_ROOT, {
      params: new HttpParams()
        .set('limit', limit.toString())
        .set('offset', offset.toString())
        .set('n_document', n_document.toString())
        .set('n_document_dir', n_document_dir)
        .set('start_date', start_date)
        .set('finish_date', finish_date)
      }).pipe(
      map(res => {
        this.patientsCount = res['count'];
        console.log(res['results']);
        return  res['results'];
      })
    );
  }

  updatePatient(patientData: PatientData) {
    return this.httpClient.put(
              this.url_root + this.PATIENTS_ROOT + '/' + patientData.id,
              JSON.stringify({
                first_name: patientData.first_name,
                last_name: patientData.last_name,
                gender: patientData.gender,
                doc_type: patientData.doc_type,
                n_document: patientData.n_document,
                email: patientData.email,
                address: patientData.address,
                birthday: patientData.birthday,
              })
            ).pipe(
              map(res => {
                  return res;
              })
            );
  }

  createPatient(patientData: PatientData) {
    const birthday_date: Date = new Date(patientData.birthday);
    const birthday_string: string =  birthday_date.toISOString().slice(0, 10);

    const jsonData = JSON.stringify({
      first_name: patientData.first_name,
      last_name: patientData.last_name,
      gender: patientData.gender,
      email: patientData.email,
      birthday: birthday_string,
      n_document: patientData.n_document,
      doc_type: patientData.doc_type,
      address: patientData.address
    });
    console.log(`El valor del json: ${jsonData}`);
    return this.httpClient.post(
      this.url_root + this.PATIENTS_ROOT,
      jsonData
    ).pipe(
      map(res => {
          return res;
      }),
      catchError(err => {console.log(err); return of([]); })
    );
    // .catch(err => {console.log(err); return of([]); })
  }

  deletePatient(patientId: number) {
    return this.httpClient.delete(
      this.url_root + this.PATIENTS_ROOT + '/' + patientId)
    .pipe(
      map(res => res)
    );
  }
}
