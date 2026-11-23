import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { LOADER_BAR_MS, LOADER_BAR_W } from '../constants/config';
import { theme } from '../constants/theme';

const BOKEH = [
  { x: 0.12, y: 0.16, size: 22 },
  { x: 0.78, y: 0.12, size: 16 },
  { x: 0.22, y: 0.74, size: 28 },
  { x: 0.86, y: 0.62, size: 18 },
  { x: 0.52, y: 0.08, size: 14 },
  { x: 0.08, y: 0.48, size: 20 },
  { x: 0.9, y: 0.86, size: 24 },
];

/**
 * Brand card only. No call to action, no chips, no touch handler: the screen is
 * held by a timer in App.tsx and the deep plum overlay keeps it far away from
 * the blush Menu in every image comparison.
 */
export function LoaderScreen() {
  const plate = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const bokehAnim = useRef(new Animated.Value(0)).current;

  const bokeh = useMemo(() => BOKEH, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(plate, { toValue: 1, tension: 48, friction: 7, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(180),
        Animated.timing(titleIn, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]),
    ]).start();

    // The progress bar is the single width animation in the app, so it must
    // stay on the JS driver. Transform and opacity everywhere else are native.
    Animated.timing(barWidth, {
      toValue: LOADER_BAR_W,
      duration: LOADER_BAR_MS,
      useNativeDriver: false,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bokehAnim, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(bokehAnim, { toValue: 0, duration: 1300, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [barWidth, bokehAnim, plate, titleIn]);

  const plateScale = plate.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] });
  const titleShift = titleIn.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const bokehOpacity = bokehAnim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.18] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={assets.bg} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={[...theme.gradients.loader]} style={[StyleSheet.absoluteFill, styles.veil]} />
      </ImageBackground>

      {bokeh.map((dot, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={[
            styles.bokeh,
            {
              left: `${dot.x * 100}%`,
              top: `${dot.y * 100}%`,
              width: dot.size,
              height: dot.size,
              borderRadius: dot.size / 2,
              opacity: bokehOpacity,
            },
          ]}
        />
      ))}

      <View style={styles.center}>
        <View pointerEvents="none" style={styles.blob} />

        <Animated.View
          pointerEvents="none"
          style={[styles.plate, { opacity: plate, transform: [{ scale: plateScale }] }]}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={{ opacity: titleIn, transform: [{ translateY: titleShift }] }}>
          <Text style={styles.title}>SWEET CANDY BONBON</Text>
          <Text style={styles.subtitle}>BONBON ATELIER · SWEET PUZZLES</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFillWrap, { width: barWidth }]}>
            <LinearGradient
              colors={[theme.colors.gold, theme.colors.primary]}
              style={styles.barFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loadingCaption}>LOADING...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.loader.from },
  veil: { opacity: 0.88 },
  bokeh: { position: 'absolute', backgroundColor: '#FFFFFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  blob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,120,190,0.25)',
    top: '18%',
  },
  plate: {
    width: 176,
    height: 176,
    borderRadius: 44,
    backgroundColor: theme.colors.loader.plate,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
    shadowColor: '#1E0A19',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 10,
  },
  logo: { width: 148, height: 148 },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: 2.4,
    color: theme.colors.loader.text,
    textAlign: 'center',
    textShadowColor: '#7A1E58',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 3,
    color: theme.colors.loader.sub,
    textAlign: 'center',
  },
  barTrack: {
    marginTop: 42,
    width: 220,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
  },
  barFillWrap: { height: 10, borderRadius: 5, overflow: 'hidden' },
  barFill: { flex: 1, borderRadius: 5 },
  loadingCaption: {
    marginTop: 18,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.loader.caption,
  },
});
