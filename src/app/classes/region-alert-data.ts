import { SilhouetteData } from './silhouette-data';
import { RecordData } from './record-data';

export class RegionAlertData {
  id: number;
  region: string;
  status: string;
  count: number;
  created_at: string;
  finish_date: string;
  repositioning: number;
  // start_date: string;
  // silhouette: SilhouetteData;
  // record: RecordData;
  // sabana: number;
}
