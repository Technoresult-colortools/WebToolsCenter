import { Metadata } from 'next';
import ScreenResolutionCheckerClient from './ScreenResolutionCheckerClient';
export const metadata: Metadata = {
    title: 'Advanced Screen Resolution Checker | WebToolsCenter',
    description: 'Analyze your screen properties and display capabilities with our Advanced Screen Checker. Get detailed information about resolution, color depth, refresh rate, and more.',
    keywords: 'screen checker, display analyzer, screen resolution, color depth, refresh rate, pixel density, device type detection, HDR capability, multi-monitor setup, screen information tool'
};

export default function AdvancedScreenChecker() {
  return <ScreenResolutionCheckerClient />;
}