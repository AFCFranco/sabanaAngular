import { SabanaData } from './sabana-data';
import { PatientData } from './patient-data';

export class RecordData {
  id: number;
  sabana: SabanaData;
  created_at: string;
  start_date: string;
  finish_date: string;
  repositioning_count: number;
  status: string;
  patient: PatientData;
  reg_alerts_secs: string;
  // condition: string;
}
