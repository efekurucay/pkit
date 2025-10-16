import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Panel, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Plus, Palette, Download } from 'lucide-react';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Hello' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'World' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function CanvasToolbar({ onAddNode, onExport }) {
  return (
    <Panel position="top-left" className="flex gap-2 p-2">
      <TooltipProvider>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-2">
              <Button variant="ghost" onClick={() => onAddNode('prompt')}>
                📝 Prompt Node
              </Button>
              <Button variant="ghost" onClick={() => onAddNode('aiModel')}>
                🤖 AI Model Node
              </Button>
              <Button variant="ghost" onClick={() => onAddNode('output')}>
                📤 Output Node
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Palette className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Node Rengi Değiştir</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onExport}>
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>PNG/JSON olarak Dışa Aktar</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Panel>
  );
}

function CanvasView({ isElectronReady }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    if (!isElectronReady) return;

    const saveCanvas = async () => {
      if (!window.electronAPI?.canvases) {
        console.error('electronAPI.canvases is not available');
        return;
      }
      try {
        const canvasData = {
          id: 'default-canvas',
          name: 'Default Canvas',
          data: JSON.stringify({ nodes, edges }),
          viewport: JSON.stringify({ x: 0, y: 0, zoom: 1 }),
        };
        await window.electronAPI.canvases.update('default-canvas', canvasData);
      } catch (error) {
        console.error('Error saving canvas:', error);
      }
    };

    const timeoutId = setTimeout(saveCanvas, 1000);
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, isElectronReady]);

  useEffect(() => {
    const loadCanvas = async () => {
      if (!window.electronAPI?.canvases) {
        console.error('electronAPI.canvases is not available');
        return;
      }
      try {
        const canvases = await window.electronAPI.canvases.getAll();
        if (canvases.length > 0) {
          const canvas = canvases[0];
          const { nodes, edges } = JSON.parse(canvas.data);
          setNodes(nodes);
          setEdges(edges);
        } else {
          const canvasData = {
            id: 'default-canvas',
            name: 'Default Canvas',
            data: JSON.stringify({ nodes: initialNodes, edges: initialEdges }),
            viewport: JSON.stringify({ x: 0, y: 0, zoom: 1 }),
          };
          await window.electronAPI.canvases.create(canvasData);
        }
      } catch (error) {
        console.error('Error loading canvas:', error);
      }
    };

    if (isElectronReady) {
      loadCanvas();
    }
  }, [isElectronReady, setNodes, setEdges]);

  const addNode = (type) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label: `${type} Node` },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
        <MiniMap />
        <CanvasToolbar onAddNode={addNode} onExport={() => console.log('Exporting...')} />
      </ReactFlow>
    </div>
  );
}

export default CanvasView;
