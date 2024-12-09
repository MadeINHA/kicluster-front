import { axiosInstance } from 'api/axios';
import { RecommendedArea } from 'slices/area/types';

export const getRecommendedAreas = () => axiosInstance.get('/clusters/refresh');

export const getProhibitedAreas = () => axiosInstance.get('/fixed-area/prohibit');

export const getExistingAreas = () => axiosInstance.get('/fixed-area/exist');
