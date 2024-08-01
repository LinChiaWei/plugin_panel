import { PanelPlugin } from '@grafana/data';
import { MyPanel } from './SimplePanel';
import { SteepChangeOptions } from './types';

export const plugin = new PanelPlugin<SteepChangeOptions>(MyPanel).setPanelOptions(builder => {
  return builder
    .addNumberInput({
      path: 'steepnessThreshold',
      name: 'Steepness Threshold',
      description: 'Threshold for detecting steep changes',
      defaultValue: 0.5,
    });
});
