import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { CardShadow, Spacing, TeamColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  visible: boolean;
  title: string;
  selected: string;
  onSelect: (color: string) => void;
  onClose: () => void;
};

/** Swatch sheet for choosing a team's colour. */
export function ColorPicker({ visible, title, selected, onSelect, onClose }: Props) {
  const c = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Tapping anywhere off the card dismisses, so the sheet needs no cancel button. */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.card, CardShadow, { backgroundColor: c.card }]} onPress={() => {}}>
          <Text style={[styles.title, { color: c.text }]}>{title}</Text>
          <View style={styles.swatches}>
            {TeamColors.map((color) => (
              <Pressable
                key={color}
                onPress={() => onSelect(color)}
                hitSlop={6}
                style={[
                  styles.swatch,
                  { backgroundColor: color },
                  color === selected && { borderColor: c.text, borderWidth: 3 },
                ]}
              />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(30, 26, 20, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: { borderRadius: 24, padding: Spacing.lg, gap: Spacing.md, maxWidth: 460 },
  title: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.md },
  swatch: { width: 52, height: 52, borderRadius: 999 },
});
