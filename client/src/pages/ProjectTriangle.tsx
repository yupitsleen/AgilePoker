import React, { useState, useRef } from 'react';
import { useRoomStore } from '../stores/roomStore';
import html2canvas from 'html2canvas';

type Corner = 'top' | 'bottomLeft' | 'bottomRight';

export const ProjectTriangle: React.FC = () => {
  const { room } = useRoomStore();
  const triangleRef = useRef<HTMLDivElement>(null);

  const [corners, setCorners] = useState({
    top: { label: 'Fast', selected: false },
    bottomLeft: { label: 'Quality', selected: false },
    bottomRight: { label: 'Cheap', selected: false },
  });

  if (!room) {
    return <div className="p-8">Loading...</div>;
  }

  const selectedCorners = Object.entries(corners).filter(([, corner]) => corner.selected);
  const selectedCount = selectedCorners.length;

  const toggleCorner = (cornerKey: Corner) => {
    setCorners(prev => {
      const newCorners = { ...prev };

      if (selectedCount === 2 && !prev[cornerKey].selected) {
        // If 2 are already selected and trying to select a third
        // Find the first selected and deselect it
        const firstSelected = Object.keys(newCorners).find(
          key => newCorners[key as Corner].selected
        ) as Corner;
        if (firstSelected) {
          newCorners[firstSelected].selected = false;
        }
      }

      newCorners[cornerKey].selected = !prev[cornerKey].selected;
      return newCorners;
    });
  };

  const updateLabel = (cornerKey: Corner, label: string) => {
    setCorners(prev => ({
      ...prev,
      [cornerKey]: { ...prev[cornerKey], label },
    }));
  };

  const exportAsPNG = async () => {
    if (!triangleRef.current) return;

    try {
      const canvas = await html2canvas(triangleRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `project-triangle-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting triangle:', error);
      alert('Failed to export image');
    }
  };

  const reset = () => {
    setCorners({
      top: { label: 'Fast', selected: false },
      bottomLeft: { label: 'Quality', selected: false },
      bottomRight: { label: 'Cheap', selected: false },
    });
  };

  // Calculate triangle points (equilateral triangle)
  const size = 300;
  const centerX = 250;
  const centerY = 200;
  const height = (size * Math.sqrt(3)) / 2;

  const topPoint = { x: centerX, y: centerY - (height * 2) / 3 };
  const bottomLeftPoint = { x: centerX - size / 2, y: centerY + height / 3 };
  const bottomRightPoint = { x: centerX + size / 2, y: centerY + height / 3 };

  const isEdgeSelected = (corner1: Corner, corner2: Corner) => {
    return corners[corner1].selected && corners[corner2].selected;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 md:p-8">
      <div className="max-w-4xl w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Project Management Triangle
        </h2>

        <p className="text-gray-600 text-center mb-8">
          Select any 2 corners. You can't have all 3!
        </p>

        {/* Triangle Visualization */}
        <div ref={triangleRef} className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <svg
            viewBox="0 0 500 400"
            className="w-full h-auto"
            style={{ maxHeight: '500px' }}
          >
            {/* Triangle edges */}
            <line
              x1={topPoint.x}
              y1={topPoint.y}
              x2={bottomLeftPoint.x}
              y2={bottomLeftPoint.y}
              stroke={isEdgeSelected('top', 'bottomLeft') ? '#10B981' : '#EF4444'}
              strokeWidth="4"
            />
            <line
              x1={topPoint.x}
              y1={topPoint.y}
              x2={bottomRightPoint.x}
              y2={bottomRightPoint.y}
              stroke={isEdgeSelected('top', 'bottomRight') ? '#10B981' : '#EF4444'}
              strokeWidth="4"
            />
            <line
              x1={bottomLeftPoint.x}
              y1={bottomLeftPoint.y}
              x2={bottomRightPoint.x}
              y2={bottomRightPoint.y}
              stroke={isEdgeSelected('bottomLeft', 'bottomRight') ? '#10B981' : '#EF4444'}
              strokeWidth="4"
            />

            {/* Corner circles */}
            <circle
              cx={topPoint.x}
              cy={topPoint.y}
              r="15"
              fill={corners.top.selected ? '#10B981' : '#EF4444'}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleCorner('top')}
            />
            <circle
              cx={bottomLeftPoint.x}
              cy={bottomLeftPoint.y}
              r="15"
              fill={corners.bottomLeft.selected ? '#10B981' : '#EF4444'}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleCorner('bottomLeft')}
            />
            <circle
              cx={bottomRightPoint.x}
              cy={bottomRightPoint.y}
              r="15"
              fill={corners.bottomRight.selected ? '#10B981' : '#EF4444'}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleCorner('bottomRight')}
            />

            {/* Labels */}
            <text
              x={topPoint.x}
              y={topPoint.y - 30}
              textAnchor="middle"
              className="font-bold text-lg fill-gray-800"
              style={{ fontSize: '20px' }}
            >
              {corners.top.label}
            </text>
            <text
              x={bottomLeftPoint.x}
              y={bottomLeftPoint.y + 40}
              textAnchor="middle"
              className="font-bold text-lg fill-gray-800"
              style={{ fontSize: '20px' }}
            >
              {corners.bottomLeft.label}
            </text>
            <text
              x={bottomRightPoint.x}
              y={bottomRightPoint.y + 40}
              textAnchor="middle"
              className="font-bold text-lg fill-gray-800"
              style={{ fontSize: '20px' }}
            >
              {corners.bottomRight.label}
            </text>
          </svg>
        </div>

        {/* Label Customization */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customize Labels</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Top Corner
              </label>
              <input
                type="text"
                value={corners.top.label}
                onChange={(e) => updateLabel('top', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bottom Left Corner
              </label>
              <input
                type="text"
                value={corners.bottomLeft.label}
                onChange={(e) => updateLabel('bottomLeft', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bottom Right Corner
              </label>
              <input
                type="text"
                value={corners.bottomRight.label}
                onChange={(e) => updateLabel('bottomRight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Selection Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium">
            {selectedCount === 0 && 'Click on the triangle corners to select your priorities (select 2)'}
            {selectedCount === 1 && 'Select one more corner'}
            {selectedCount === 2 && `Selected: ${selectedCorners.map(([, c]) => c.label).join(' + ')}`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={exportAsPNG}
            disabled={selectedCount !== 2}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            Export as PNG
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">
            <strong>Green</strong> = Selected priorities | <strong>Red</strong> = Not selected
          </p>
          <p>
            The Project Management Triangle illustrates that you can only optimize for two out of three constraints.
          </p>
        </div>
      </div>
    </div>
  );
};
