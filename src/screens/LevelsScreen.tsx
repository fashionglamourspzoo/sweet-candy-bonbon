import React, { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Droplet, Lock } from 'lucide-react-native';
import { spriteFor } from '../assets';
import { theme } from '../constants/theme';
import { EmptyState } from '../components/EmptyState';
import { ScreenFrame } from '../components/ScreenFrame';
import { StarsBadge } from '../components/ScreenHeader';
import { StarRow } from '../components/StarRow';
import { availableStars, totalStarsEarned } from '../game/progressStore';
import {
  LOCATIONS,
  STAGES_PER_LOCATION,
  getStage,
  locationUnlocked,
  stageUnlocked,
  starsInLocation,
} from '../game/stages';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../hooks/useSettings';

type Props = {
  onBack: () => void;
  onSelectStage: (index: number) => void;
};

export function LevelsScreen({ onBack, onSelectStage }: Props) {
  const progress = useProgress();
  const { reducedMotion } = useSettings();
  const totalStars = totalStarsEarned(progress);
  const [location, setLocation] = useState(0);

  const unlocked = locationUnlocked(location, totalStars);

  const handleChip = useCallback((index: number) => {
    setLocation(index);
  }, []);

  return (
    <ScreenFrame
      title="LEVELS"
      subtitle="PUZZLE MAP · FOUR CANDY GARDENS"
      overlay={theme.gradients.library}
      reducedMotion={reducedMotion}
      onBack={onBack}
      rightSlot={<StarsBadge value={availableStars(progress)} />}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}>
        {LOCATIONS.map(item => {
          const open = locationUnlocked(item.index, totalStars);
          const active = item.index === location;
          return (
            <Pressable
              key={item.index}
              accessibilityRole="button"
              accessibilityLabel={item.name}
              onPress={() => handleChip(item.index)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[
                styles.chip,
                active ? { borderColor: item.accent, backgroundColor: item.accent + '1A' } : null,
              ]}>
              {open ? null : <Lock size={14} color={theme.colors.text.tertiary} strokeWidth={2.5} />}
              <Text
                numberOfLines={1}
                style={[styles.chipText, active ? { color: item.accent } : null]}>
                {item.name}
              </Text>
              <Text style={styles.chipStars}>
                {`${starsInLocation(item.index, progress.stageStars)}/15`}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {unlocked ? (
        <ScrollView
          style={styles.grid}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}>
          {Array.from({ length: STAGES_PER_LOCATION }, (_v, i) => {
            const stageIndex = location * STAGES_PER_LOCATION + i;
            const stage = getStage(stageIndex);
            const open = stageUnlocked(stageIndex, progress.stageStars, totalStars);
            const earned = progress.stageStars[stageIndex] ?? 0;
            const objective = stage.objectives[0];

            if (!open) {
              return (
                <View key={stageIndex} style={styles.nodeSlot}>
                  <View style={[styles.node, styles.nodeLocked]}>
                    <Lock size={22} color={theme.colors.text.tertiary} strokeWidth={2.5} />
                    <Text style={styles.nodeLockedText}>{`STAGE ${stageIndex + 1}`}</Text>
                    <Text style={styles.nodeHint}>CLEAR THE ONE BEFORE</Text>
                  </View>
                </View>
              );
            }

            return (
              <View key={stageIndex} style={styles.nodeSlot}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`STAGE ${stageIndex + 1}`}
                  onPress={() => onSelectStage(stageIndex)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={styles.nodePress}>
                  <View style={[styles.node, { borderColor: LOCATIONS[location].accent + '66' }]}>
                    <Text style={styles.nodeNumber}>{stageIndex + 1}</Text>
                    <View style={styles.nodeIcon}>
                      {objective && objective.kind === 'collect' ? (
                        <Image
                          source={spriteFor(objective.ing)}
                          style={styles.nodeSprite}
                          resizeMode="contain"
                        />
                      ) : (
                        <Droplet size={22} color={theme.colors.gold} strokeWidth={2.5} />
                      )}
                    </View>
                    <StarRow earned={earned} total={3} size={13} />
                    <Text style={styles.nodeMoves}>{`${stage.moves} MOVES`}</Text>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <EmptyState
          accent={LOCATIONS[location].accent}
          text={`KEEP COOKING — ${LOCATIONS[location].starsToOpen} STARS OPEN THIS GARDEN`}
        />
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  chipScroll: { flexGrow: 0, marginTop: 8, marginBottom: 10 },
  chipRow: { gap: 8, paddingRight: 8 },
  chip: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  chipStars: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    color: theme.colors.gold,
  },
  grid: { flex: 1 },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 20,
  },
  nodeSlot: { width: '47%' },
  nodePress: { width: '100%' },
  node: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    gap: 4,
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  nodeLocked: { backgroundColor: theme.colors.bg.locked, borderColor: '#E8D3E0' },
  nodeLockedText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    color: theme.colors.text.secondary,
  },
  nodeHint: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.tertiary,
  },
  nodeNumber: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    color: theme.colors.text.primary,
  },
  nodeIcon: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  nodeSprite: { width: 26, height: 26 },
  nodeMoves: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
  },
});
