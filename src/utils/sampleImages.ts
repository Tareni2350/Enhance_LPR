import { BoundingBox } from '../types/lpr';
import sedanDelhiImg from '../assets/images/indian_sedan_delhi_1795066645902.jpg';
import suvAngledImg from '../assets/images/indian_suv_angled_1795066646040.jpg';
import evGreenImg from '../assets/images/indian_ev_green_1795066646388.jpg';
import blurryRainImg from '../assets/images/indian_blurry_rain_1795066647068.jpg';
import taxiYellowImg from '../assets/images/indian_taxi_yellow_1795066647206.jpg';

export interface SampleVehicle {
  id: string;
  name: string;
  category: string;
  description: string;
  plateNumber: string;
  plateType: string;
  state: string;
  isBlurrySample?: boolean;
  dataUrl: string;
  fallbackBox: BoundingBox;
}

export const SAMPLE_VEHICLES: SampleVehicle[] = [
  {
    id: 'sample-delhi-sedan',
    name: 'Delhi Private Sedan (Real Street Photo)',
    category: 'Private Sedan',
    description:
      'Real-world street photograph of a white sedan in Delhi with an official white High Security Registration Plate (HSRP).',
    plateNumber: 'DL 01 CA 9081',
    plateType: 'Standard Private (White)',
    state: 'Delhi (NCT)',
    isBlurrySample: false,
    dataUrl: sedanDelhiImg,
    fallbackBox: { ymin: 625, xmin: 292, ymax: 715, xmax: 438 },
  },
  {
    id: 'sample-mh-suv-angled',
    name: 'Pune SUV in Motion (Angled Perspective)',
    category: 'SUV / Crossover',
    description:
      'Three-quarter angled highway photo of a red SUV in Pune. Tests perspective angle compensation & OCR extraction.',
    plateNumber: 'MH 12 DE 1433',
    plateType: 'Standard Private (White)',
    state: 'Maharashtra',
    isBlurrySample: false,
    dataUrl: suvAngledImg,
    fallbackBox: { ymin: 590, xmin: 264, ymax: 662, xmax: 358 },
  },
  {
    id: 'sample-ev-green',
    name: 'Electric SUV at Charging Bay (Green Plate)',
    category: 'Electric Vehicle (EV)',
    description:
      'Real EV charging station scene showing an official Indian green background EV registration plate with white text.',
    plateNumber: 'DL 03 EV 2024',
    plateType: 'Electric Vehicle (Green)',
    state: 'Delhi (NCT)',
    isBlurrySample: false,
    dataUrl: evGreenImg,
    fallbackBox: { ymin: 648, xmin: 426, ymax: 722, xmax: 584 },
  },
  {
    id: 'sample-blurry-rain',
    name: 'Rainy Night Traffic Cam (Motion Blur)',
    category: 'Low Light / Rain Blur',
    description:
      'Dusk rainy traffic CCTV frame with motion blur and wet road glare. Triggers conditional Laplacian deblurring.',
    plateNumber: 'TN 07 CM 3412',
    plateType: 'Standard Private (White)',
    state: 'Tamil Nadu',
    isBlurrySample: true,
    dataUrl: blurryRainImg,
    fallbackBox: { ymin: 636, xmin: 374, ymax: 685, xmax: 438 },
  },
  {
    id: 'sample-commercial-yellow',
    name: 'Ahmedabad Commercial Taxi (Yellow Plate)',
    category: 'Commercial / Transport',
    description:
      'Sunny urban street capture of a commercial passenger cab with bright yellow plate and black HSRP characters.',
    plateNumber: 'GJ 01 TT 6543',
    plateType: 'Commercial Transport (Yellow)',
    state: 'Gujarat',
    isBlurrySample: false,
    dataUrl: taxiYellowImg,
    fallbackBox: { ymin: 726, xmin: 364, ymax: 786, xmax: 488 },
  },
];
