import React from 'react';

interface HashedProfilePictureProps {
  hash: string;
  size?: number;
}

export const HashedProfilePicture: React.FC<HashedProfilePictureProps> = ({ hash, size = 100 }) => {
  const GRID_SIZE = 8;
  const colors = ['#0a0a1a', '#00ffff', '#ff00ff', '#00ff00', '#1a1a2e', '#ff0000'];
  
  const getCellColor = (char1: string, char2: string) => {
    const value = (parseInt(char1, 16) + parseInt(char2, 16)) % colors.length;
    return colors[value];
  };

  // Use the middle of the hash for more variance
  const seed = hash.substring(hash.length / 2 - GRID_SIZE, hash.length / 2 + GRID_SIZE);

  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const charIndex = (y * GRID_SIZE + x) % seed.length;
      const charIndex2 = (charIndex + GRID_SIZE) % seed.length;
      const color = getCellColor(seed[charIndex], seed[charIndex2]);
      
      // Create a symmetric pattern
      const mirroredX = GRID_SIZE - 1 - x;
      cells.push(<rect key={`${y}-${x}`} x={x * (size / GRID_SIZE)} y={y * (size / GRID_SIZE)} width={size / GRID_SIZE} height={size / GRID_SIZE} fill={color} />);
      cells.push(<rect key={`${y}-${mirroredX}`} x={mirroredX * (size / GRID_SIZE)} y={y * (size / GRID_SIZE)} width={size / GRID_SIZE} height={size / GRID_SIZE} fill={color} />);
    }
  }

  return (
    <div className="rounded-full overflow-hidden border-2 border-nun-primary/50 shadow-lg" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {cells}
      </svg>
    </div>
  );
};