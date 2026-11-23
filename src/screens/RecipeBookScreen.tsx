import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { spriteFor } from '../assets';
import { theme } from '../constants/theme';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionCard } from '../components/SectionCard';
import { RECIPES } from '../game/stages';
import { recipesDiscovered } from '../game/progressStore';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../hooks/useSettings';

type Props = {
  onBack: () => void;
};

export function RecipeBookScreen({ onBack }: Props) {
  const progress = useProgress();
  const { reducedMotion } = useSettings();
  const discovered = recipesDiscovered(progress);

  return (
    <ScreenFrame
      title="RECIPE BOOK"
      subtitle={`${discovered} OF ${RECIPES.length} LEARNED`}
      overlay={theme.gradients.library}
      reducedMotion={reducedMotion}
      onBack={onBack}>
      {discovered === 0 ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            NO RECIPES YET — PLAY A STAGE TO LEARN ONE
          </Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {RECIPES.map(recipe => {
          const known = progress.recipes[recipe.index];
          return (
            <View key={recipe.index} style={styles.slot}>
              <SectionCard
                muted={!known}
                accent={known ? theme.colors.secondary : undefined}
                style={styles.card}>
                <View style={styles.cardTop}>
                  {known ? (
                    <Image
                      source={spriteFor(recipe.ingredients[0])}
                      style={styles.sprite}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.lockPlate}>
                      <Lock size={20} color={theme.colors.text.tertiary} strokeWidth={2.5} />
                    </View>
                  )}
                </View>
                <Text numberOfLines={2} style={[styles.name, known ? null : styles.nameLocked]}>
                  {known ? recipe.name : `COOK STAGE ${recipe.stageIndex + 1} TO LEARN`}
                </Text>
                {known ? (
                  <View style={styles.dots}>
                    {recipe.ingredients.map((ing, i) => (
                      <View
                        key={i}
                        style={[styles.dot, { backgroundColor: theme.ingredients[ing].color }]}
                      />
                    ))}
                  </View>
                ) : null}
                {known ? (
                  <Text style={styles.stageLine}>{`LEARNED ON STAGE ${recipe.stageIndex + 1}`}</Text>
                ) : null}
              </SectionCard>
            </View>
          );
        })}
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  notice: {
    marginTop: 8,
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
  scroll: { flex: 1, marginTop: 10 },
  content: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20 },
  slot: { width: '48%' },
  card: { paddingVertical: 12, alignItems: 'center', minHeight: 124 },
  cardTop: { height: 44, alignItems: 'center', justifyContent: 'center' },
  sprite: { width: 40, height: 40 },
  lockPlate: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8D3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  nameLocked: { fontSize: 10, lineHeight: 14, color: theme.colors.text.tertiary },
  dots: { flexDirection: 'row', gap: 5, marginTop: 8 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  stageLine: {
    marginTop: 6,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.secondary,
  },
});
