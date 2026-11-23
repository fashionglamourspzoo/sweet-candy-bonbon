import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BookOpen,
  Calendar,
  Gift,
  GraduationCap,
  Map,
  Settings as SettingsIcon,
  ShoppingBag,
  Star,
} from 'lucide-react-native';
import { assets, spriteFor } from '../assets';
import { COMPACT, HUB_ROW_H } from '../constants/config';
import { theme } from '../constants/theme';
import { HubTile } from '../components/HubTile';
import { ScreenFrame } from '../components/ScreenFrame';
import { StarsBadge } from '../components/ScreenHeader';
import { currentStageIndex, getStage } from '../game/stages';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../hooks/useSettings';
import { availableStars, recipesDiscovered, totalStarsEarned } from '../game/progressStore';

type Props = {
  onPlay: () => void;
  onLevels: () => void;
  onDaily: () => void;
  onRecipes: () => void;
  onCollection: () => void;
  onRewards: () => void;
  onTutorial: () => void;
  onSettings: () => void;
  dailyAvailable: boolean;
};

export function MenuScreen(props: Props) {
  const progress = useProgress();
  const { reducedMotion } = useSettings();

  const stars = availableStars(progress);
  const recipes = recipesDiscovered(progress);
  const stageIndex = currentStageIndex(progress.stageStars, totalStarsEarned(progress));
  const stage = getStage(stageIndex);

  const breathe = useRef(new Animated.Value(0)).current;
  const playScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reducedMotion) {
      breathe.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe, reducedMotion]);

  const pressIn = useCallback(() => {
    Animated.spring(playScale, { toValue: 0.96, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [playScale]);
  const pressOut = useCallback(() => {
    Animated.spring(playScale, { toValue: 1, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [playScale]);

  const breatheScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] });
  const heroH = COMPACT ? 138 : 152;

  return (
    <ScreenFrame
      title="SWEET CANDY BONBON"
      subtitle="BONBON ATELIER"
      overlay={theme.gradients.menu}
      reducedMotion={reducedMotion}
      leftSlot={<Image source={assets.logo} style={styles.brandMark} resizeMode="contain" />}
      rightSlot={<StarsBadge value={stars} />}>
      <View style={styles.body}>
        <View style={[styles.heroRow, { height: heroH }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="PLAY"
            onPress={props.onPlay}
            onPressIn={pressIn}
            onPressOut={pressOut}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[styles.heroPress, { height: heroH }]}>
            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.heroTile,
                { height: heroH, transform: [{ scale: playScale }, { scale: breatheScale }] },
              ]}>
              <LinearGradient
                colors={[...theme.gradients.pink]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroFill}>
                <Image source={assets.buttonRect} style={styles.heroPlate} resizeMode="stretch" />
                <Image source={spriteFor(0)} style={styles.heroSprite} resizeMode="contain" />
                <Text style={styles.heroLabel}>PLAY</Text>
                <Text numberOfLines={2} style={styles.heroSub}>
                  {stage.title}
                </Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>

          <View style={[styles.heroSide, { height: heroH }]}>
            <View style={[styles.statTile, { height: (heroH - 10) / 2 }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.gold + '1F' }]}>
                <Star size={20} color={theme.colors.gold} fill={theme.colors.gold} strokeWidth={2} />
              </View>
              <View style={styles.statTexts}>
                <Text style={[styles.statValue, { color: theme.colors.gold }]}>{stars}</Text>
                <Text style={styles.statLabel}>STARS</Text>
              </View>
            </View>
            <View style={[styles.statTile, { height: (heroH - 10) / 2 }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.secondary + '1F' }]}>
                <BookOpen size={20} color={theme.colors.secondary} strokeWidth={2.5} />
              </View>
              <View style={styles.statTexts}>
                <Text style={[styles.statValue, { color: theme.colors.secondary }]}>{`${recipes}/10`}</Text>
                <Text style={styles.statLabel}>RECIPES</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <HubTile
            label="LEVELS"
            subLabel="PUZZLE MAP"
            Icon={Map}
            accent={theme.colors.secondary}
            onPress={props.onLevels}
            height={HUB_ROW_H}
            delay={60}
            reducedMotion={reducedMotion}
            style={styles.half}
          />
          <HubTile
            label="DAILY CHALLENGE"
            subLabel="MODIFIER OF THE DAY"
            Icon={Calendar}
            accent={theme.colors.caramel}
            onPress={props.onDaily}
            height={HUB_ROW_H}
            badge={props.dailyAvailable}
            delay={120}
            reducedMotion={reducedMotion}
            style={styles.half}
          />
        </View>

        <View style={styles.row}>
          <HubTile
            label="RECIPE BOOK"
            subLabel={`${recipes} OF 10 LEARNED`}
            Icon={BookOpen}
            accent={theme.colors.primary}
            onPress={props.onRecipes}
            height={HUB_ROW_H}
            delay={180}
            reducedMotion={reducedMotion}
            style={styles.half}
          />
          <HubTile
            label="COLLECTION"
            subLabel="INGREDIENT PANTRY"
            Icon={ShoppingBag}
            accent={theme.colors.mint}
            onPress={props.onCollection}
            height={HUB_ROW_H}
            delay={240}
            reducedMotion={reducedMotion}
            style={styles.half}
          />
        </View>

        <View style={styles.row}>
          <HubTile
            label="REWARDS"
            subLabel="ATELIER DECOR"
            Icon={Gift}
            accent={theme.colors.gold}
            onPress={props.onRewards}
            height={HUB_ROW_H}
            delay={300}
            reducedMotion={reducedMotion}
            style={styles.half}
          />
          <HubTile
            label="TUTORIAL"
            subLabel="HOW TO PLAY"
            Icon={GraduationCap}
            accent={theme.colors.info}
            onPress={props.onTutorial}
            height={HUB_ROW_H}
            delay={360}
            reducedMotion={reducedMotion}
            style={styles.half}
          />
        </View>

        <HubTile
          label="SETTINGS"
          subLabel="SHAPES · MOTION · HINTS"
          Icon={SettingsIcon}
          accent="#8A5E7E"
          onPress={props.onSettings}
          height={COMPACT ? 56 : 60}
          delay={420}
          reducedMotion={reducedMotion}
        />
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  brandMark: { width: 36, height: 36, borderRadius: 12 },
  body: { flex: 1, paddingTop: 8, paddingBottom: 16, gap: 10 },
  heroRow: { flexDirection: 'row', gap: 10 },
  heroPress: { flex: 1.62, borderRadius: 30 },
  heroTile: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#D81B6E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 20,
    elevation: 9,
  },
  heroFill: { flex: 1, borderRadius: 30, padding: 14, justifyContent: 'flex-end' },
  heroPlate: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.22,
  },
  heroSprite: { position: 'absolute', right: 10, bottom: 10, width: 64, height: 64 },
  heroLabel: {
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: theme.colors.text.inverse,
    textShadowColor: 'rgba(122,30,88,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroSub: {
    marginTop: 2,
    width: '70%',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: 'rgba(255,255,255,0.88)',
  },
  heroSide: { flex: 1, gap: 10 },
  statTile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.bg.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTexts: { flex: 1 },
  statValue: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
});
