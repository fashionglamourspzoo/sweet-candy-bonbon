import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BOARD_FRAME, BOARD_H, BOARD_W, TILE } from '../constants/config';
import { theme } from '../constants/theme';
import { Board } from '../game/types';
import { CandyTile } from './CandyTile';

type Props = {
  board: Board;
  selected: number | null;
  hint: [number, number] | null;
  glyphMode: boolean;
  reducedMotion: boolean;
  dimmed: boolean;
  onTilePress: (index: number) => void;
};

/**
 * The clay tray and its absolutely positioned candies. Geometry is deterministic:
 * every tile sits at BOARD_FRAME + col * TILE, so the board can never overflow.
 */
function CandyBoardBase({
  board,
  selected,
  hint,
  glyphMode,
  reducedMotion,
  dimmed,
  onTilePress,
}: Props) {
  return (
    <View style={[styles.tray, { width: BOARD_W, height: BOARD_H, opacity: dimmed ? 0.55 : 1 }]}>
      <View pointerEvents="none" style={styles.inner} />
      {board.cells.map((cell, index) => {
        if (!cell) {
          return null;
        }
        const row = Math.floor(index / board.cols);
        const col = index % board.cols;
        return (
          <CandyTile
            key={cell.id}
            index={index}
            ing={cell.ing}
            special={cell.special}
            syrup={board.syrup[index]}
            size={TILE}
            left={BOARD_FRAME + col * TILE}
            top={BOARD_FRAME + row * TILE}
            selected={selected === index}
            hinted={hint ? hint[0] === index || hint[1] === index : false}
            glyphMode={glyphMode}
            reducedMotion={reducedMotion}
            onPress={onTilePress}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    backgroundColor: theme.colors.bg.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    borderColor: theme.colors.borderSoft,
    overflow: 'hidden',
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  },
  inner: {
    position: 'absolute',
    left: 4,
    top: 4,
    right: 4,
    bottom: 4,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg.sunken,
  },
});

export const CandyBoard = memo(CandyBoardBase);
