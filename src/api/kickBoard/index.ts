import { axiosInstance } from 'api/axios';

export const getKickBoards = () => axiosInstance.get('/kickboards/all');
