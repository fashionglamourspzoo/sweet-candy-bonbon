import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

type Props = {
  size: number;
  radius?: number;
  opacity?: number;
};

/**
 * The claymorphism gloss: a soft white ellipse in the upper-left third.
 * Reused by every candy and every round plate so the surfaces read as one material.
 * Plain fills only — no shared gradient ids, which collide across Svg roots on Android.
 */
function GlossHighlightBase({ size, radius = 0, opacity = 0.45 }: Props) {
  return (
    <View
      pointerEvents="none"
      style={[styles.wrap, { width: size, height: size, borderRadius: radius }]}>
      <Svg width={size} height={size}>
        <Ellipse
          cx={size * 0.36}
          cy={size * 0.26}
          rx={size * 0.3}
          ry={size * 0.17}
          fill="#FFFFFF"
          fillOpacity={opacity}
        />
        <Ellipse
          cx={size * 0.66}
          cy={size * 0.76}
          rx={size * 0.22}
          ry={size * 0.12}
          fill="#FFFFFF"
          fillOpacity={opacity * 0.3}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
});

export const GlossHighlight = memo(GlossHighlightBase);
