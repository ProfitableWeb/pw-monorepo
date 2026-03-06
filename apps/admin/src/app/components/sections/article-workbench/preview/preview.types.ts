/**
 * Типы, пресеты устройств и константы для модуля превью.
 * Пресеты содержат реальные разрешения экранов (CSS-пиксели) для точной эмуляции.
 */
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import type { DeviceType } from '@/app/types/article-editor';

export const WEB_URL = (
  import.meta.env.VITE_WEB_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export const DEVICE_TABS: Record<
  DeviceType,
  { label: string; icon: typeof Monitor }
> = {
  desktop: { label: 'Десктоп', icon: Monitor },
  tablet: { label: 'Планшет', icon: Tablet },
  mobile: { label: 'Мобильный', icon: Smartphone },
};

export interface DevicePreset {
  label: string;
  width: number;
  height: number;
}

export const TABLET_PRESETS: DevicePreset[] = [
  { label: 'iPad Air 11"', width: 820, height: 1180 },
  { label: 'iPad Air 13"', width: 1024, height: 1366 },
  { label: 'iPad mini', width: 744, height: 1133 },
  { label: 'iPad Pro 11"', width: 834, height: 1210 },
  { label: 'iPad Pro 13"', width: 1032, height: 1376 },
  { label: 'iPad (10th)', width: 820, height: 1180 },
  { label: 'Surface Pro 7', width: 912, height: 1368 },
];

export const MOBILE_PRESETS: DevicePreset[] = [
  { label: 'iPhone 16 Pro Max', width: 430, height: 932 },
  { label: 'iPhone 16 Pro', width: 393, height: 852 },
  { label: 'iPhone 16', width: 390, height: 844 },
  { label: 'iPhone SE', width: 375, height: 667 },
  { label: 'Galaxy S25 Ultra', width: 412, height: 891 },
  { label: 'Galaxy S25', width: 360, height: 780 },
  { label: 'Galaxy Z Fold 5', width: 373, height: 839 },
  { label: 'Pixel 9 Pro XL', width: 414, height: 921 },
  { label: 'Pixel 9', width: 412, height: 923 },
  { label: 'Xiaomi 14', width: 360, height: 800 },
  { label: 'Xiaomi 14 Pro', width: 412, height: 915 },
  { label: 'OnePlus 12', width: 412, height: 915 },
  { label: 'OPPO Find X7', width: 412, height: 915 },
  { label: 'Huawei Mate 60 Pro', width: 360, height: 800 },
  { label: 'Honor Magic6 Pro', width: 412, height: 900 },
  { label: 'Nothing Phone (2)', width: 412, height: 919 },
];

export function getPresetsForDevice(device: DeviceType): DevicePreset[] {
  if (device === 'tablet') return TABLET_PRESETS;
  if (device === 'mobile') return MOBILE_PRESETS;
  return [];
}
