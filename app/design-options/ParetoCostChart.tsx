"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ECharts, EChartsOption } from "echarts";
import { formatPrice, getCostViewLabel, type CostView } from "../../data/cost-profiles";

export type ParetoPoint = {
  id: string;
  model: string;
  company: string;
  sourceUrl?: string;
  icon?: string;
  score: number;
  std?: number;
  effectiveCost: number;
  isFrontier: boolean;
};

const palette = {
  gold: "#d8cba6",
  text: "#e1e2df",
  muted: "#8993a0",
  rule: "rgba(216,203,166,.24)",
  grid: "rgba(216,203,166,.10)",
  background: "rgba(3,11,22,.96)"
};

export default function ParetoCostChart({ points, costView }: { points: ParetoPoint[]; costView: CostView }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);

  const option = useMemo<EChartsOption>(() => {
    const maxCost = Math.max(...points.map((point) => point.effectiveCost), 0.05 * 1.02);
    const maxScore = Math.max(60, Math.ceil(Math.max(...points.map((point) => point.score), 60) / 5) * 5);
    const frontier = points.filter((point) => point.isFrontier).sort((a, b) => a.effectiveCost - b.effectiveCost);
    const scatterData = points.map((point) => ({
      ...point,
      value: [point.effectiveCost, point.score],
      itemStyle: {
        color: "rgba(5,13,25,.92)",
        borderColor: point.isFrontier ? palette.gold : "rgba(216,203,166,.38)",
        borderWidth: point.isFrontier ? 1.6 : 1
      }
    }));
    const logoData = points.map((point) => ({ ...point, value: [point.effectiveCost, point.score] }));
    const labelData = frontier.map((point) => ({ ...point, value: [point.effectiveCost, point.score] }));

    return {
      animation: false,
      grid: { left: 62, right: 28, top: 26, bottom: 61, containLabel: false },
      xAxis: {
        type: "log",
        logBase: 10,
        min: 0.05,
        max: maxCost,
        name: `${getCostViewLabel(costView)} · LOG SCALE`,
        nameLocation: "middle",
        nameGap: 39,
        nameTextStyle: { color: palette.muted, fontFamily: "Roboto, Arial, sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: 1.1 },
        axisLine: { lineStyle: { color: palette.rule } },
        axisTick: { show: false },
        axisLabel: { color: palette.muted, fontFamily: "Roboto, Arial, sans-serif", fontSize: 9, formatter: (value: number) => formatPrice(value), hideOverlap: true },
        splitLine: { show: true, lineStyle: { color: palette.grid, type: "solid" } },
        minorTick: { show: true },
        minorSplitLine: { show: true, lineStyle: { color: "rgba(216,203,166,.045)" } }
      },
      yAxis: {
        type: "value",
        min: 15,
        max: maxScore,
        name: "PHYSICS-IQ VERIFIED",
        nameLocation: "middle",
        nameGap: 42,
        nameTextStyle: { color: palette.muted, fontFamily: "Roboto, Arial, sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: 1.1 },
        axisLine: { lineStyle: { color: palette.rule } },
        axisTick: { show: false },
        axisLabel: { color: palette.muted, fontFamily: "Roboto, Arial, sans-serif", fontSize: 9, formatter: (value: number) => `${value}%` },
        splitNumber: 5,
        splitLine: { lineStyle: { color: palette.grid } }
      },
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: palette.background,
        borderColor: palette.rule,
        borderWidth: 1,
        textStyle: { color: palette.muted, fontFamily: "Roboto, Arial, sans-serif", fontSize: 11 },
        formatter: (rawParams) => {
          const params = Array.isArray(rawParams) ? rawParams[0] : rawParams;
          const datum = params?.data as ParetoPoint | undefined;
          if (!datum?.model) return "";
          const sd = datum.std === undefined ? "" : ` ± ${datum.std.toFixed(2)}`;
          return `<strong style="color:${palette.text}">${datum.model}</strong><br/>${datum.company}<br/>Score: ${datum.score.toFixed(2)}${sd}%<br/>${getCostViewLabel(costView)}: ${formatPrice(datum.effectiveCost)}`;
        }
      },
      series: [
        {
          type: "line",
          data: frontier.map((point) => [point.effectiveCost, point.score]),
          symbol: "none",
          silent: true,
          lineStyle: { color: "rgba(216,203,166,.78)", width: 2, shadowColor: "rgba(216,203,166,.35)", shadowBlur: 7 },
          z: 1
        },
        {
          type: "scatter",
          data: scatterData,
          symbol: "circle",
          symbolSize: 26,
          emphasis: { scale: false, focus: "self" },
          z: 2
        },
        {
          type: "scatter",
          data: logoData,
          symbol: (value, params) => {
            const datum = params.data as { icon?: string };
            return datum.icon ? `image://${datum.icon}` : "circle";
          },
          symbolSize: 17,
          symbolKeepAspect: true,
          z: 3
        },
        {
          type: "scatter",
          data: labelData,
          symbol: "circle",
          symbolSize: 1,
          silent: true,
          tooltip: { show: false },
          itemStyle: { opacity: 0 },
          label: {
            show: true,
            position: "right",
            distance: 12,
            color: palette.gold,
            fontFamily: "Roboto, Arial, sans-serif",
            fontSize: 10,
            fontWeight: 600,
            backgroundColor: "rgba(3,11,22,.92)",
            borderColor: "rgba(216,203,166,.30)",
            borderWidth: 1,
            borderRadius: 2,
            padding: [4, 6],
            formatter: (params) => (params.data as ParetoPoint).model
          },
          labelLayout: { moveOverlap: "shiftY", hideOverlap: true },
          z: 10
        }
      ]
    };
  }, [costView, points]);

  const optionRef = useRef(option);
  optionRef.current = option;

  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;
    let chart: ECharts | undefined;

    void import("echarts").then(({ init }) => {
      if (disposed || !containerRef.current) return;
      chart = init(containerRef.current, undefined, { renderer: "canvas" });
      chartRef.current = chart;
      chart.setOption(optionRef.current);
      chart.on("click", (params) => {
        const datum = params.data as ParetoPoint | undefined;
        if (datum?.sourceUrl) window.open(datum.sourceUrl, "_blank", "noopener,noreferrer");
      });
      resizeObserver = new ResizeObserver(() => chart?.resize());
      resizeObserver.observe(containerRef.current);
    });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      chart?.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge: true });
  }, [option]);

  return <div ref={containerRef} className="preview-pareto-plot" role="img" aria-label="Score versus cost Pareto chart; labels automatically avoid overlap" />;
}
