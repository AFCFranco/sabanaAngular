import {
  Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ViewContainerRef, ComponentFactory,
  ComponentFactoryResolver
} from '@angular/core';
import { SabanasDetailsComponent } from '../sabanas-details/sabanas-details.component';
import * as moment from 'moment';
import { WebSocketService } from '../../services/websocket.service';
import { UserService } from '../../services/user.service';
import { SabanasAndRecordDataSource } from '../../classes/sabanas-and-record-data-source';
import { SabanaAndRecordData } from '../../classes/sabana-and-record-data';
import { RecordData } from '../../classes/record-data';
import { SabanaData } from '../../classes/sabana-data';
import { MatDialog } from '@angular/material';
import { DialogRepositioningComponent } from '../../dialog-repositioning/dialog-repositioning.component';

@Component({
  selector: 'app-sabanas',
  templateUrl: './sabanas.component.html',
  styleUrls: ['./sabanas.component.css']
})
export class SabanasComponent implements OnInit, OnDestroy, AfterViewInit {


  dataSource: SabanasAndRecordDataSource;
  expandedRow: number;
  @ViewChildren('cdkrow', { read: ViewContainerRef }) rowContainers;
  displayedColumns = [
    'nick',
    'sabana_status',
    'patient',
    'gender',
    'n_document',
    'record_status',
    // 'condition',
    'actions',
  ];
  genderChoices = {
    'M': 'Masculino',
    'F': 'Femenino'
  };


  constructor(private wsService: WebSocketService, private userService: UserService,
    private resolver: ComponentFactoryResolver, public dialogRepositioning: MatDialog) { }

  ngOnInit() {
    this.userService.userObs.subscribe(msg => {
      if (msg !== null) {
        this.obtainSubscriptions();
      }
    });
  }

  ngAfterViewInit() {

  }

  public obtainSubscriptions() {
    // Cuando se conecte/desconecte una sábana se reacciona actualizando la tabla
    this.wsService.connect().subscribe(msg => {
      if (msg.msg_type === 'sabana_message') {
        if (msg.sabana_message === 'sabana_status') {
          this.loadSabanasAndRecords();
        }
      }
    });
    this.wsService.deleteRecordObs.subscribe(msg => {
      if (msg === true) {
        this.loadSabanasAndRecords();
        this.wsService.deleteRecordBehaviorSubject.next(false);
      }
    });
    this.wsService.finishRecordObs.subscribe(msg => {
      if (msg === true) {
        this.loadSabanasAndRecords();
        this.wsService.finishRecordBehaviorSubject.next(false);
      }
    });
    this.wsService.stopRecordObs.subscribe(msg => {
      if (msg === true) {
        console.log('entro en el stop record');
        this.loadSabanasAndRecords();
        this.wsService.stopRecordBehaviorSubject.next(false);
      }
    });
    this.wsService.startRecordObs.subscribe(msg => {
      if (msg === true) {
        console.log('entro en el start record');
        this.loadSabanasAndRecords();
        this.wsService.startRecordBehaviorSubject.next(false);
        // this.wsService.send({
        //   'msg_type': 'request',
        //   'request': 'create_repositioning',
        //   'details': {
        //     'record': sabanaAndRecord.record.id
        //   }
        // });
      }
    });
    this.dataSource = new SabanasAndRecordDataSource(this.wsService, this.userService);
    this.loadSabanasAndRecords();
  }

  public loadSabanasAndRecords() {
    this.expandedRow = null;
    if (this.dataSource) {
      this.dataSource.loadSabanasAndRecords();
    }
  }

  public expandRow(index: number, row) {
    if (this.expandedRow != null) {
      this.rowContainers.toArray()[this.expandedRow].clear(); // Se limpia el contenedor
    }
    if (this.expandedRow === index) {
      this.expandedRow = null;
    } else {
      const container = this.rowContainers.toArray()[index];
      const factory: ComponentFactory<SabanasDetailsComponent> = this.resolver.resolveComponentFactory(SabanasDetailsComponent);
      const patientDetailsComponent = container.createComponent(factory);
      patientDetailsComponent.instance.sabanaAndRecordData = row;
      patientDetailsComponent.instance.parentSabanasComponent = <SabanasComponent>this;
      this.expandedRow = index;
    }
  }


  deleteRecord(event, sabanaAndRecord: SabanaAndRecordData) {
    event.stopPropagation();
    if (confirm('¿Desea realmente eliminar el registro asociado al paciente?')) {
      console.log('se eliminará el registro de la sábana: ' + sabanaAndRecord.sabana.nick);
      this.wsService.send({
        'msg_type': 'request',
        'request': 'delete_record',
        'details': {
          'record': sabanaAndRecord.record.id
        }
      });
    }
  }

  finishRecord(event, sabanaAndRecord: SabanaAndRecordData) {
    event.stopPropagation();
    if (confirm('¿Desea realmente finalizar el registro asociado al paciente?')) {
      console.log('se eliminará el registro de la sábana: ' + sabanaAndRecord.sabana.nick);
      this.wsService.send({
        'msg_type': 'request',
        'request': 'finish_record',
        'details': {
          'record': sabanaAndRecord.record.id
        }
      });
    }
  }

  stopRecord(event, sabanaAndRecord: SabanaAndRecordData) {
    event.stopPropagation();
    if (confirm('¿Desea realmente pausar el registro asociado al paciente?')) {
      this.wsService.send({
        'msg_type': 'request',
        'request': 'stop_record',
        'details': {
          'record': sabanaAndRecord.record.id
        }
      });
    }
  }


  startRecord(event, sabanaAndRecord: SabanaAndRecordData) {
    event.stopPropagation();
    const dialogRef = this.dialogRepositioning.open(DialogRepositioningComponent, {
      width: '400px',
      data: {
        'record': sabanaAndRecord.record.id,
        'silhouette': null,
        'alarms_setpoints': [
          {
            region: 'R1',
            sensibility: 0,
            minutes: 5,
          },
          {
            region: 'R2',
            sensibility: 0,
            minutes: 5,
          },
          {
            region: 'R3',
            sensibility: 0,
            minutes: 5,
          },
          {
            region: 'R4',
            sensibility: 0,
            minutes: 5,
          },
          {
            region: 'R5',
            sensibility: 0,
            minutes: 5,
          },
        ],
        'isEnableCondition': true,
        'condition': ''
      }
    });
    dialogRef.componentInstance.title = 'Condiciones de inicio';
    dialogRef.componentInstance.subtitle = 'Seleccione la posición del paciente a partir de la cual se iniciará  el monitoreo';

    dialogRef.afterClosed().subscribe( result => {
      if (result === undefined) {
        // console.log('valor ingresado incorrecto');
      } else {
        // console.log(result);
        this.wsService.send({
          'msg_type': 'request',
          'request': 'start_record',
          'details': {
            'record': result.record,
            'silhouette': result.silhouette,
            'alarms_setpoints': result.alarms_setpoints,
            'condition': result.condition
          }
        });
      }
    });
    // if (confirm('¿Desea realmente iniciar el registro asociado al paciente?')) {
    //   this.wsService.send({
    //     'msg_type': 'request',
    //     'request': 'start_record',
    //     'details': {
    //       'record': sabanaAndRecord.record.id
    //     }
    //   });
    // }
  }

  getRecordInfoTooltip(record: RecordData) {

    return `Fecha inicio: ${moment(record.created_at).format('MM/DD/YYYY hh:mm a')}\n
    Estado: ${record.status === 'A' ? 'Activo' : 'Inactivo'}`;
  }


  getSabanaInfoTooltip(sabana: SabanaData) {

    return `Ultima conexión: ${moment(sabana.last_connection_date).format('MM/DD/YYYY hh:mm a')}\n
    Estado: ${sabana.status === 'C' ? 'Conectada' : 'Desconectada'}`;
  }

  ngOnDestroy() {
    this.dataSource.disconnect();
  }



}
