/*
 * This file contains utility functions for calculating the position of nodes
 * in the mind map.
 */

const SPACE_BETWEEN_NODES = 200;

export function getNodePosition(i: number, numCols: number) {
  const x = SPACE_BETWEEN_NODES * (i % numCols);
  const y = SPACE_BETWEEN_NODES * Math.floor(i / numCols);
  return { x, y };
}

export function getBounds(numCols: number) {
  const x = 0;
  const y = 0;
  const width = SPACE_BETWEEN_NODES * numCols;
  const height = SPACE_BETWEEN_NODES * numCols;
  return { x, y, width, height };
}
