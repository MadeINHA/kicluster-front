import { KickBoard } from "slices/kickBoard/types";

export interface Area {
  name: string;
  path: { lat: number; lng: number }[];
}

export interface RecommendedArea {
  cluster_id: number;
  kickboard_list: KickBoard[];
}

export interface ProhibitedArea extends Area { }

export interface ExistingArea extends Area { }

export interface AreaState {
  recommendedAreas: null | RecommendedArea[];
  prohibitedAreas: null | ProhibitedArea[];
  existingAreas: null | ExistingArea[];
}
