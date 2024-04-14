import React, { memo } from 'react';

interface Props {
  cellsRange: Map<string, any>;
}

const CellsRange = memo(({ cellsRange }: Props) => {
  console.log(cellsRange);
  return <div className='absolute top-5'>CellsRange</div>;
});

export default CellsRange;
