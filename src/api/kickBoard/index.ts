import { axiosInstance } from 'api/axios';
// import kickBoards from '../dummies/kickBoards.json';
// import kickBoards2 from '../dummies/kickBoards2.json';

// let test = 1;

export const getKickBoards = () => axiosInstance.get('/kickboards/all');
//   {
//   if (test > 0) {
//     test *= -1;
//     return { data: { data: { kickboard_list: kickBoards } } };
//   } else {
//     test *= -1;
//     return { data: { data: { kickboard_list: kickBoards2 } } };
//   }
// };

export const lentKickBoard = (
  kickboard_id: number,
  path: { lat: number; lng: number }[],
) => axiosInstance.patch('/kickboards/tow/lent', { kickboard_id, path });

export const returnKickBoard = () =>
  axiosInstance.patch('/kickboards/tow/return');
