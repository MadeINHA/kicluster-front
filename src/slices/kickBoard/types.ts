export interface KickBoard {
  kickboardId: number;
  lat: number;
  lng: number;
  clusterId: number;
  parkingZone: number;
}

export interface KickBoardState {
  kickBoards: null | KickBoard[];
}
