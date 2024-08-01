import React, { useState, useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { useStyles2, TimeSeries, TooltipPlugin, TooltipDisplayMode, LegendDisplayMode } from '@grafana/ui';
import { css } from '@emotion/css';

interface SteepChangeOptions {
  steepnessThreshold: number;
}

export const SteepChangePanel: React.FC<PanelProps<SteepChangeOptions>> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);
  const [annotations, setAnnotations] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.series && data.series.length > 0) {
      const series = data.series[0];
      const timeField = series.fields.find(f => f.type === 'time');
      const valueField = series.fields.find(f => f.type === 'number');

      if (timeField && valueField) {
        const newAnnotations = [];
        const times = timeField.values.toArray();
        const values = valueField.values.toArray();

        for (let i = 1; i < values.length; i++) {
          const timeDiff = times[i] - times[i-1];
          const valueDiff = Math.abs(values[i] - values[i-1]);
          const steepness = valueDiff / timeDiff;

          if (steepness > options.steepnessThreshold) {
            newAnnotations.push({
              time: times[i],
              text: `Steep change: ${steepness.toFixed(2)}`,
            });
          }
        }

        setAnnotations(newAnnotations);
      }
    }
  }, [data, options.steepnessThreshold]);

  const timeZone = data.request?.timezone || 'browser';

  const timeseriesOptions: React.ComponentProps<typeof TimeSeries> = {
    frames: data.series,
    timeRange: data.timeRange,
    timeZone: timeZone,
    width: width,
    height: height,
    legend: {
      displayMode: LegendDisplayMode.List,
      placement: 'bottom',
      calcs: [],
      showLegend: true,
    },
    options: {
      tooltip: { mode: TooltipDisplayMode.Single },
    },
  };

  return (
    <div className={styles.wrapper} style={{ width, height }}>
      <TimeSeries {...timeseriesOptions}>
        {(config, alignedDataFrame) => {
          return (
            <TooltipPlugin
              config={config}
              data={alignedDataFrame}
              mode={TooltipDisplayMode.Single}
              timeZone={timeZone}
            />
          );
        }}
      </TimeSeries>
      {annotations.map((anno, index) => (
        <div
          key={index}
          className={styles.annotation}
          style={{
            left: `${(anno.time - data.timeRange.from.valueOf()) / (data.timeRange.to.valueOf() - data.timeRange.from.valueOf()) * 100}%`,
          }}
        >
          ↓
        </div>
      ))}
    </div>
  );
};

const getStyles = () => {
  return {
    wrapper: css`
      position: relative;
    `,
    annotation: css`
      position: absolute;
      top: 10px;
      transform: translateX(-50%);
      color: red;
      font-size: 20px;
    `,
  };
};