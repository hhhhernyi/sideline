import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { SPORTS } from '@/constants/sports';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const GUTTER = Spacing.md;
/** Space between cards AND between a card and the screen edge - one value keeps them equal. */
const CARD_GAP = Spacing.xl;
/** Icon size as a share of the card - kept clear of the label pinned to the bottom. */
const ICON_SCALE = 0.46;
/** Rough vertical room taken by the header band and the gaps around the grid. */
const HEADER_ALLOWANCE = 130;
/** The app is landscape-only, so a row always fits four cards - however many sports there are. */
const COLUMNS = 4;
/** Ceiling on card size - space-evenly turns whatever is left over into wider margins. */
const MAX_CARD = 150;

export default function SportPickerScreen() {
  const c = useTheme();
  const { width, height } = useWindowDimensions();
  // In landscape the island/notch sits on one side, so the grid has to start inside the insets.
  const insets = useSafeAreaInsets();
  const usable = width - insets.left - insets.right;

  // Each card sits in a fixed slot, so exactly COLUMNS fit per row however big the card is -
  // card size and cards-per-row stay independent.
  const cardWidth = Math.min(
    Math.floor((usable - CARD_GAP * (COLUMNS + 1)) / COLUMNS),
    height - HEADER_ALLOWANCE,
    MAX_CARD,
  );
  // n cards and n+1 equal gaps fill the usable width. A slot is one card plus one gap, so
  // solving 4*card + 5*gap = usable gives this; half a gap of padding at each edge then makes
  // the outer margins match the spacing between cards exactly.
  const slotWidth = Math.floor((usable + cardWidth) / (COLUMNS + 1));
  const edgePad = Math.round((slotWidth - cardWidth) / 2);

  return (
    <ScrollView contentContainerStyle={styles.screen} style={{ backgroundColor: c.background }}>
      <ScreenHeader title="Pick a sport" />
      <View
        style={[
          styles.grid,
          { paddingLeft: insets.left + edgePad, paddingRight: insets.right + edgePad },
        ]}>
        {SPORTS.map((sport) => (
          <View key={sport.id} style={[styles.slot, { width: slotWidth }]}>
            <Link href={{ pathname: '/game/[sport]', params: { sport: sport.id } }} asChild>
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
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // No padding here - the header band runs full-bleed and the grid's own gaps space the cards.
  screen: { paddingBottom: GUTTER, gap: Spacing.lg },
  // Slots tile the usable width exactly, so a full row fills it and a short last row fills
  // from the left.
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', rowGap: CARD_GAP },
  slot: { alignItems: 'center' },
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
