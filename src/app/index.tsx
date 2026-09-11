import { Link } from 'expo-router';
import { OrientationLock } from 'expo-screen-orientation';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { SPORTS } from '@/constants/sports';
import { CardShadow, Spacing } from '@/constants/theme';
import { useOrientationLock } from '@/hooks/use-orientation';
import { useTheme } from '@/hooks/use-theme';

export default function SportPickerScreen() {
  const c = useTheme();
  const { width, height } = useWindowDimensions();
  useOrientationLock(OrientationLock.DEFAULT);

  const columns = width > height ? 4 : 2;
  const cardSize = (width - Spacing.lg * 2 - Spacing.md * (columns - 1)) / columns;

  return (
    <ScrollView contentContainerStyle={styles.screen} style={{ backgroundColor: c.background }}>
      <Text style={[styles.heading, { color: c.text }]}>Pick a sport</Text>
      <View style={styles.grid}>
        {SPORTS.map((sport) => (
          <Link key={sport.id} href={{ pathname: '/game/[sport]', params: { sport: sport.id } }} asChild>
            <Pressable
              style={({ pressed }) => [
                styles.card,
                CardShadow,
                {
                  width: cardSize,
                  height: cardSize,
                  backgroundColor: sport.tint,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}>
              <Text style={styles.emoji}>{sport.emoji}</Text>
              <Text style={[styles.name, { color: c.text }]}>{sport.name}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: Spacing.lg, gap: Spacing.lg },
  heading: { fontSize: 28, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  card: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  emoji: { fontSize: 56 },
  name: { fontSize: 18, fontWeight: '700' },
});
