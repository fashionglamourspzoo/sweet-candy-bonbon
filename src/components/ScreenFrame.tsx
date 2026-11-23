import React, { memo, useEffect, useRef } from 'react';
import { Animated, ImageBackground, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { TIMING, motion } from '../constants/config';
import { theme } from '../constants/theme';
import { RoundPlateButton, ScreenHeader } from './ScreenHeader';

type Props = {
  title: string;
  subtitle?: string | null;
  onBack?: () => void;
  backLabel?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  overlay?: readonly string[];
  reducedMotion?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

/**
 * Background + gradient overlay + clay blobs + the shared header.
 * Every screen except the Loader is built on this frame, so the four depth
 * layers (background, blobs, clay surface, element) are identical everywhere.
 */
function ScreenFrameBase({
  title,
  subtitle,
  onBack,
  backLabel = 'MENU',
  leftSlot,
  rightSlot,
  overlay = theme.gradients.library,
  reducedMotion = false,
  contentStyle,
  children,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: motion(TIMING.navFade, reducedMotion),
      useNativeDriver: true,
    }).start();
  }, [enter, reducedMotion]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ImageBackground source={assets.bg} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={[...overlay]} style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <View pointerEvents="none" style={[styles.blob, styles.blobTop]} />
      <View pointerEvents="none" style={[styles.blob, styles.blobBottom]} />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.content, contentStyle, { opacity: enter, transform: [{ translateY }] }]}>
        <ScreenHeader
          title={title}
          subtitle={subtitle}
          leftSlot={
            leftSlot ??
            (onBack ? (
              <RoundPlateButton icon={assets.iconHome} label={backLabel} onPress={onBack} />
            ) : null)
          }
          rightSlot={rightSlot}
        />
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  content: { flex: 1, paddingTop: 44, paddingHorizontal: 16 },
  blob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.5,
  },
  blobTop: { top: -56, left: -48, backgroundColor: '#FFD3E8' },
  blobBottom: { bottom: -62, right: -52, backgroundColor: '#E8D6FF' },
});

export const ScreenFrame = memo(ScreenFrameBase);
