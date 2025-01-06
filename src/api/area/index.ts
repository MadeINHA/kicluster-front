import { axiosInstance } from 'api/axios';

export const getRecommendedAreas = () => axiosInstance.get('/clusters/refresh');

export const getProhibitedAreas = () =>
  axiosInstance.get('/fixed-area/prohibit');

export const getExistingAreas = () => axiosInstance.get('/fixed-area/exist');

export const getFixedAreaNearest = (lat: number, lng: number) =>
  axiosInstance.get('/fixed-area/nearest', { params: { lat, lng } });

export const getClusterNearest = (lat: number, lng: number) =>
  axiosInstance.get('/clusters/nearest', { params: { lat, lng } });
