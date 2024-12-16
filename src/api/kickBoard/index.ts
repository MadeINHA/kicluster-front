import { axiosInstance } from 'api/axios';

export const checkKickBoardMove = (id: number, lat: number, lng: number) =>
  axiosInstance.post('/kickboards/move/check', { id, lat, lng });

export const returnKickBoardMove = (id: number, lat: number, lng: number) =>
  axiosInstance.patch('/kickboards/move/return', { id, lat, lng });

export const getKickBoards = () => axiosInstance.get('/kickboards/all');
