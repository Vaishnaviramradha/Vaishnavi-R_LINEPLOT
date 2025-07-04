'use client';
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback } from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const LinePlot = () => {
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedXColumn, setSelectedXColumn] = useState('');
  const [selectedYColumns, setSelectedYColumns] = useState<string[]>([]);
  const [plotTitle, setPlotTitle] = useState('Interactive Line Plot');
  const [xAxisLabel, setXAxisLabel] = useState('X-Axis');
  const [yAxisLabel, setYAxisLabel] = useState('Y-Axis');
  const [lineStyle, setLineStyle] = useState<'solid' | 'dash' | 'dot'>('solid');
  const [showMarkers, setShowMarkers] = useState(true);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [plotData, setPlotData] = useState<any[]>([]);

  useEffect(() => {
    const dummy = [
      { year: 2000, sales: 100, profit: 20 },
      { year: 2001, sales: 120, profit: 30 },
      { year: 2002, sales: 150, profit: 50 },
    ];
    setOriginalData(dummy);
    const cols = Object.keys(dummy[0]);
    setColumns(cols);
    setSelectedXColumn(cols[0]);
    setSelectedYColumns([cols[1]]);
    setColors({ [cols[1]]: '#1f77b4' });
  }, []);

  const updatePlotData = useCallback(() => {
    if (!originalData.length || !selectedXColumn || selectedYColumns.length === 0) {
      setPlotData([]);
      return;
    }

    const newPlotData = selectedYColumns.map((yCol) => {
      const currentColor =
        colors[yCol] || '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      return {
        x: originalData.map((row) => row[selectedXColumn]),
        y: originalData.map((row) => row[yCol]),
        mode: showMarkers ? 'lines+markers' : 'lines',
        name: yCol,
        type: 'scatter',
        line: { color: currentColor, dash: lineStyle },
        marker: { size: 8, color: currentColor },
      };
    });
    setPlotData(newPlotData);
  }, [originalData, selectedXColumn, selectedYColumns, lineStyle, showMarkers, colors]);

  useEffect(() => {
    updatePlotData();
  }, [updatePlotData]);

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV or JSON:</label>
        <input
          type="file"
          accept=".csv,.json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
              const content = event.target?.result;
              try {
                if (file.name.endsWith('.csv')) {
                  import('papaparse').then(Papa => {
                    Papa.parse(content as string, {
                      header: true,
                      dynamicTyping: true,
                      complete: (results: any) => {
                        const data = results.data;
                        const cols = Object.keys(data[0]);
                        setOriginalData(data);
                        setColumns(cols);
                        setSelectedXColumn(cols[0]);
                        setSelectedYColumns([cols[1]]);
                        setColors({});
                      }
                    });
                  });
                } else if (file.name.endsWith('.json')) {
                  const jsonData = JSON.parse(content as string);
                  if (Array.isArray(jsonData)) {
                    const cols = Object.keys(jsonData[0]);
                    setOriginalData(jsonData);
                    setColumns(cols);
                    setSelectedXColumn(cols[0]);
                    setSelectedYColumns([cols[1]]);
                    setColors({});
                  }
                }
              } catch (err) {
                alert("File parsing error");
              }
            };
            reader.readAsText(file);
          }}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2"
        />
      </div>

      {/* Config Panel */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">X-Axis Column:</label>
          <select
            value={selectedXColumn}
            onChange={(e) => setSelectedXColumn(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">Y-Axis Column(s):</label>
          <select
            multiple
            value={selectedYColumns}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions, o => o.value);
              setSelectedYColumns(options);
              const newColors = { ...colors };
              options.forEach(col => {
                if (!newColors[col]) {
                  newColors[col] = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                }
              });
              setColors(newColors);
            }}
            className="border rounded px-2 py-1 w-full h-24"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">Line Style:</label>
          <select
            value={lineStyle}
            onChange={(e) => setLineStyle(e.target.value as any)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="solid">Solid</option>
            <option value="dash">Dashed</option>
            <option value="dot">Dotted</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mt-5">
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={(e) => setShowMarkers(e.target.checked)}
          />
          <label className="text-sm">Show Markers</label>
        </div>
      </div>

      {/* Axis + Title */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm">Plot Title:</label>
          <input
            type="text"
            value={plotTitle}
            onChange={(e) => setPlotTitle(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm">X Axis Label:</label>
          <input
            type="text"
            value={xAxisLabel}
            onChange={(e) => setXAxisLabel(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm">Y Axis Label:</label>
          <input
            type="text"
            value={yAxisLabel}
            onChange={(e) => setYAxisLabel(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      {/* Colors */}
      {selectedYColumns.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Line Colors:</label>
          {selectedYColumns.map(col => (
            <div key={col} className="flex items-center gap-4 my-1">
              <span className="w-32">{col}</span>
              <input
                type="color"
                value={colors[col]}
                onChange={(e) =>
                  setColors(prev => ({ ...prev, [col]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Plot Output */}
      <Plot
        data={plotData}
        layout={{
          title: plotTitle,
          xaxis: { title: xAxisLabel },
          yaxis: { title: yAxisLabel },
          hovermode: 'closest',
          autosize: true,
          margin: { l: 60, r: 20, t: 70, b: 60 }
        }}
        config={{ responsive: true }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LinePlot;
