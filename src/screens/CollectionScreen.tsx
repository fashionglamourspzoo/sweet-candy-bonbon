import React, { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Polygon, Rect } from 'react-native-svg';
import { Check, Lock, Star } from 'lucide-react-native';
import { spriteFor } from '../assets';
import { MILESTONES } from '../constants/config';
import { theme } from '../constants/theme';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionCard } from '../components/SectionCard';
import { StarsBadge } from '../components/ScreenHeader';
import { REWARDS, RewardDef } from '../game/stages';
import { availableStars, claimReward, progressStore } from '../game/progressStore';
import { milestoneFor } from '../game/rules';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../hooks/useSettings';
import { groupNumber } from '../utils/format';

export type CollectionTab = 'ingredients' | 'rewards';

type Props = {
  initialTab: CollectionTab;
  onBack: () => void;
};

function RewardGlyph({ reward, size }: { reward: RewardDef; size: number }) {
  const c = reward.accent;
  const s = size;
  return (
    <Svg width={s} height={s}>
      {reward.shape === 'lantern' ? (
        <G>
          <Rect x={s * 0.3} y={s * 0.2} width={s * 0.4} height={s * 0.5} rx={s * 0.14} fill={c} />
          <Rect x={s * 0.44} y={s * 0.7} width={s * 0.12} height={s * 0.18} fill={c} />
        </G>
      ) : null}
      {reward.shape === 'arch' ? (
        <Path
          d={`M${s * 0.16} ${s * 0.84} V${s * 0.46} A${s * 0.34} ${s * 0.34} 0 0 1 ${s * 0.84} ${s * 0.46} V${s * 0.84}`}
          stroke={c}
          strokeWidth={s * 0.13}
          fill="none"
        />
      ) : null}
      {reward.shape === 'bench' ? (
        <G>
          <Rect x={s * 0.14} y={s * 0.48} width={s * 0.72} height={s * 0.12} rx={s * 0.06} fill={c} />
          <Rect x={s * 0.2} y={s * 0.6} width={s * 0.1} height={s * 0.26} fill={c} />
          <Rect x={s * 0.7} y={s * 0.6} width={s * 0.1} height={s * 0.26} fill={c} />
        </G>
      ) : null}
      {reward.shape === 'fountain' ? (
        <G>
          <Circle cx={s * 0.5} cy={s * 0.34} r={s * 0.14} fill={c} />
          <Path d={`M${s * 0.18} ${s * 0.78} Q${s * 0.5} ${s * 0.52} ${s * 0.82} ${s * 0.78} Z`} fill={c} />
        </G>
      ) : null}
      {reward.shape === 'fence' ? (
        <G>
          <Rect x={s * 0.2} y={s * 0.3} width={s * 0.1} height={s * 0.56} fill={c} />
          <Rect x={s * 0.45} y={s * 0.3} width={s * 0.1} height={s * 0.56} fill={c} />
          <Rect x={s * 0.7} y={s * 0.3} width={s * 0.1} height={s * 0.56} fill={c} />
          <Rect x={s * 0.14} y={s * 0.46} width={s * 0.72} height={s * 0.08} fill={c} />
        </G>
      ) : null}
      {reward.shape === 'tree' ? (
        <G>
          <Circle cx={s * 0.5} cy={s * 0.38} r={s * 0.26} fill={c} />
          <Rect x={s * 0.45} y={s * 0.6} width={s * 0.1} height={s * 0.28} fill={c} />
        </G>
      ) : null}
      {reward.shape === 'birdhouse' ? (
        <G>
          <Polygon points={`${s * 0.5},${s * 0.16} ${s * 0.84},${s * 0.46} ${s * 0.16},${s * 0.46}`} fill={c} />
          <Rect x={s * 0.24} y={s * 0.46} width={s * 0.52} height={s * 0.34} fill={c} />
        </G>
      ) : null}
      {reward.shape === 'gate' ? (
        <G>
          <Rect x={s * 0.16} y={s * 0.26} width={s * 0.12} height={s * 0.6} fill={c} />
          <Rect x={s * 0.72} y={s * 0.26} width={s * 0.12} height={s * 0.6} fill={c} />
          <Path d={`M${s * 0.28} ${s * 0.36} Q${s * 0.5} ${s * 0.14} ${s * 0.72} ${s * 0.36}`} stroke={c} strokeWidth={s * 0.1} fill="none" />
        </G>
      ) : null}
    </Svg>
  );
}

export function CollectionScreen({ initialTab, onBack }: Props) {
  const progress = useProgress();
  const { reducedMotion } = useSettings();
  const [tab, setTab] = useState<CollectionTab>(initialTab);
  const stars = availableStars(progress);

  const openIngredients = useCallback(() => setTab('ingredients'), []);
  const openRewards = useCallback(() => setTab('rewards'), []);

  const onClaim = useCallback((reward: RewardDef) => {
    const current = progressStore.load();
    const next = claimReward(current, reward.index, reward.cost);
    if (next) {
      progressStore.save(next);
    }
  }, []);

  const collectedTotal = progress.collection.reduce((a, b) => a + b, 0);
  const unlockedRewards = REWARDS.filter(r => progress.rewards[r.index]);

  return (
    <ScreenFrame
      title={tab === 'ingredients' ? 'COLLECTION' : 'REWARDS'}
      subtitle={tab === 'ingredients' ? 'INGREDIENT PANTRY' : 'ATELIER DECOR · COSMETIC ONLY'}
      overlay={theme.gradients.library}
      reducedMotion={reducedMotion}
      onBack={onBack}
      rightSlot={<StarsBadge value={stars} />}>
      <View style={styles.tabs}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="INGREDIENTS"
          onPress={openIngredients}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.tab, tab === 'ingredients' ? styles.tabActive : null]}>
          <Text style={[styles.tabText, tab === 'ingredients' ? styles.tabTextActive : null]}>
            INGREDIENTS
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="REWARDS"
          onPress={openRewards}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.tab, tab === 'rewards' ? styles.tabActive : null]}>
          <Text style={[styles.tabText, tab === 'rewards' ? styles.tabTextActive : null]}>
            REWARDS
          </Text>
        </Pressable>
      </View>

      {tab === 'ingredients' ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {collectedTotal === 0 ? (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                THE PANTRY IS EMPTY — POP CANDIES IN A STAGE TO FILL IT
              </Text>
            </View>
          ) : null}
          {theme.ingredients.map((ingredient, i) => {
            const count = progress.collection[i] ?? 0;
            const { next, progress: fill } = milestoneFor(count, MILESTONES);
            return (
              <SectionCard key={ingredient.key} accent={ingredient.color} style={styles.row}>
                <View style={styles.rowInner}>
                  <View style={[styles.platePlate, { backgroundColor: ingredient.color + '1F' }]}>
                    <Image source={spriteFor(i)} style={styles.rowSprite} resizeMode="contain" />
                  </View>
                  <View style={styles.rowTexts}>
                    <Text style={styles.rowName}>{ingredient.name}</Text>
                    <Text style={styles.rowMeta}>
                      {count === 0 ? 'NOT COLLECTED YET' : `${groupNumber(count)} COLLECTED · NEXT ${next}`}
                    </Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${Math.round(fill * 100)}%`, backgroundColor: ingredient.color },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </SectionCard>
            );
          })}
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {unlockedRewards.length > 0 ? (
            <View style={styles.atelierStrip}>
              <Text style={styles.stripCaption}>YOUR ATELIER</Text>
              <View style={styles.stripRow}>
                {unlockedRewards.map(reward => (
                  <View key={reward.index} style={[styles.stripItem, { borderColor: reward.accent + '66' }]}>
                    <RewardGlyph reward={reward} size={30} />
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                NOTHING BUILT YET — EARN STARS AND CLAIM A DECORATION
              </Text>
            </View>
          )}

          <View style={styles.rewardGrid}>
            {REWARDS.map(reward => {
              const owned = progress.rewards[reward.index];
              const affordable = stars >= reward.cost;
              return (
                <View key={reward.index} style={styles.rewardSlot}>
                  <SectionCard
                    muted={!owned && !affordable}
                    accent={owned ? reward.accent : undefined}
                    style={styles.rewardCard}>
                    <RewardGlyph reward={reward} size={46} />
                    <Text numberOfLines={2} style={styles.rewardName}>
                      {reward.name}
                    </Text>
                    <View style={styles.costRow}>
                      <Star size={13} color={theme.colors.gold} fill={theme.colors.gold} strokeWidth={2} />
                      <Text style={styles.costText}>{reward.cost}</Text>
                    </View>
                    {owned ? (
                      <View style={[styles.claimed, { backgroundColor: reward.accent + '22' }]}>
                        <Check size={14} color={reward.accent} strokeWidth={3} />
                        <Text style={[styles.claimedText, { color: reward.accent }]}>BUILT</Text>
                      </View>
                    ) : (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`CLAIM ${reward.name}`}
                        accessibilityState={{ disabled: !affordable }}
                        disabled={!affordable}
                        onPress={() => onClaim(reward)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={[
                          styles.claimBtn,
                          affordable
                            ? { backgroundColor: reward.accent }
                            : styles.claimBtnDisabled,
                        ]}>
                        {affordable ? null : (
                          <Lock size={12} color={theme.colors.text.tertiary} strokeWidth={2.5} />
                        )}
                        <Text
                          style={[
                            styles.claimText,
                            affordable ? null : { color: theme.colors.text.tertiary },
                          ]}>
                          CLAIM
                        </Text>
                      </Pressable>
                    )}
                  </SectionCard>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 8, marginTop: 8 },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '1A',
  },
  tabText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  tabTextActive: { color: theme.colors.primary },
  scroll: { flex: 1, marginTop: 10 },
  listContent: { gap: 10, paddingBottom: 20 },
  notice: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  noticeText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  row: { paddingVertical: 12 },
  rowInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  platePlate: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowSprite: { width: 42, height: 42 },
  rowTexts: { flex: 1 },
  rowName: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.text.primary,
  },
  rowMeta: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.text.secondary,
  },
  barTrack: {
    marginTop: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.bg.sunken,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: 4 },
  atelierStrip: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  stripCaption: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  stripRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stripItem: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: theme.colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  rewardSlot: { width: '48%' },
  rewardCard: { alignItems: 'center', paddingVertical: 12, gap: 6 },
  rewardName: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  costRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  costText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: theme.colors.gold,
  },
  claimBtn: {
    marginTop: 2,
    height: 34,
    width: '100%',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  claimBtnDisabled: { backgroundColor: '#EEDFE8' },
  claimText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  claimed: {
    marginTop: 2,
    height: 34,
    width: '100%',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  claimedText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
