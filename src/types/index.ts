import { RootState } from './RootState';

export type { RootState };

export interface Data1 {
  cluster_list: {
    cluster_id: number;
    kickboard_list: { id: number; lat: number; lng: number }[];
  }[];
  max_cluster: number;
}

export interface Data2 {
  max_cluster: number;
  result: {
    clusterId: number;
    coordinateList: {
      latitude: number;
      longitude: number;
    }[];
  }[];
}
