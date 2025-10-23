import { useEffect } from 'react';
import { Direction } from '../types/game';

type KeyboardHandler = (direction: Direction) => void;

export const useKeyboard = (onMove: KeyboardHandler) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 기본 동작 방지 (스크롤 등)
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
      ) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onMove('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove]);
};
