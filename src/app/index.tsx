import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { OrientationLock } from 'expo-screen-orientation';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { SPORTS } from '@/constants/sports';
import { CardShadow, Spacing } from '@/constants/theme';
import { useOrientationLock } from '@/hooks/use-orientation';
import { useTheme } from '@/hooks/use-theme';

const GUTTER = Spacing.md;
/** Space between cards AND between a card and the screen edge - one value keeps them equal. */
const CARD_GAP = Spacing.lg;
/** Icon size as a share of the card - kept clear of the label pinned to the bottom. */
const ICON_SCALE = 0.46;

export default function SportPickerScreen() {
  const c = useTheme();
  const { width, height } = useWindowDimensions();
  useOrientationLock(OrientationLock.DEFAULT);

  // Tablets get 4 columns in both orientations; phones get 2 upright, 4 on their side.
  // 600pt on the short edge is the usual phone/tablet split (iPad mini portrait is 744).
  const isTablet = Math.min(width, height) >= 600;
  const columns = isTablet || width > height ? 4 : 2;
  // n cards leave n+1 equal gaps across the full width: two edges plus the spaces between.
  // Floored so a row can never round up past the space available and wrap early; space-evenly
  // then shares the leftover pixels out equally.
  const cardWidth = Math.floor((width - CARD_GAP * (columns + 1)) / columns);

  return (
    <ScrollView contentContainerStyle={styles.screen} style={{ backgroundColor: c.background }}>
      <ScreenHeader title="Pick a sport" />
      <View style={styles.grid}>
        {SPORTS.map((sport) => (
          <Link key={sport.id} href={{ pathname: '/game/[sport]', params: { sport: sport.id } }} asChild>
            {/* No `style` on the Pressable: Link's Slot merges a child's style by object spread,
                which silently discards Pressable's function form. Style the inner View instead. */}
            <Pressable>
              {({ pressed }) => (
                <View
                  style={[
                    styles.card,
                    CardShadow,
                    {
                      width: cardWidth,
                      backgroundColor: sport.tint,
                      opacity: pressed ? 0.85 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}>
                  <MaterialCommunityIcons name={sport.icon} size={cardWidth * ICON_SCALE} color={c.text} />
                  <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
                    {sport.name}
                  </Text>
                </View>
              )}
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // No padding here - the header band runs full-bleed and the grid's own gaps space the cards.
  screen: { paddingBottom: GUTTER, gap: Spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', rowGap: CARD_GAP },
  card: {
    aspectRatio: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  // Pulled out of the flow so the icon stays dead centre in the card whatever the label does.
  name: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.sm,
    right: Spacing.sm,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
