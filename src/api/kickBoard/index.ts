import { axiosInstance } from 'api/axios';

export const checkKickBoardMove = (id: number, lat: number, lng: number) =>
  axiosInstance.post('/kickboards/move/check', { id, lat, lng });

export const returnKickBoardMove = (id: number, lat: number, lng: number) =>
  axiosInstance.patch('/kickboards/move/return', { id, lat, lng });

export const getKickBoards = () => axiosInstance.get('/kickboards/all');

export const checkKickBoardsTow = (id: number, lat: number, lng: number) =>
  axiosInstance.post('/kickboards/tow/check', { id, lat, lng });

export const lentKickBoardsTow = (
  kickboard_id: number,
  path: { lat: number; lng: number }[],
) => axiosInstance.patch('/kickboards/tow/lent', { kickboard_id, path });

export const returnKickBoardsTow = (id: number, lat: number, lng: number) =>
  axiosInstance.patch('/kickboards/tow/return', { id, lat, lng });
