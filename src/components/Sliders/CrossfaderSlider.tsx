import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';

interface CrossfaderSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const CrossfaderSlider: React.FC<CrossfaderSliderProps> = ({
  value,
  onValueChange,
  min = 1,
  max = 10,
}) => {
  const sliderWidth = 300;
  const tickCount = (max - min) + 1;

  const [isDragging, setIsDragging] = useState(false);
  const panX = useRef(new Animated.Value(((value - min) / (max - min)) * sliderWidth)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        const clampedX = Math.max(0, Math.min(sliderWidth, x));
        panX.setValue(clampedX);
      },
      onPanResponderRelease: (evt) => {
        const x = evt.nativeEvent.locationX;
        const clampedX = Math.max(0, Math.min(sliderWidth, x));
        const normalizedValue = (clampedX / sliderWidth) * (max - min) + min;
        const roundedValue = Math.round(normalizedValue);
        const finalValue = Math.max(min, Math.min(max, roundedValue));
        onValueChange(finalValue);
        setIsDragging(false);
      },
    })
  ).current;

  useEffect(() => {
    if (!isDragging) {
      const newPos = ((value - min) / (max - min)) * sliderWidth;
      panX.setValue(newPos);
    }
  }, [value, isDragging]);

  return (
    <View style={styles.container}>
      <View
        style={[styles.sliderTrack, { width: sliderWidth }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.horizontalLine} />
        {Array.from({ length: tickCount }).map((_, index) => {
          const tickPosition = (index / (tickCount - 1)) * sliderWidth;
          if (index === 0 || index === tickCount - 1) {
            return (
              <View
                key={index}
                style={[
                  styles.tallTick,
                  {
                    left: tickPosition - 1,
                  },
                ]}
              />
            );
          }
          return (
            <View
              key={index}
              style={[
                styles.tick,
                {
                  left: tickPosition - 1,
                },
              ]}
            />
          );
        })}
        <Animated.View
          style={[
            styles.sliderThumb,
            {
              left: panX,
              marginLeft: -8,
            },
          ]}
        />
      </View>

      <Text style={styles.valueText}>Rating: {value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 24,
  },
  sliderTrack: {
    height: 80,
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 16,
    backgroundColor: '#f1f1f1'
  },
  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: '#999',
    top: '50%',
    marginTop: -2,
  },
  tick: {
    position: 'absolute',
    width: 3,
    height: 16,
    backgroundColor: '#999',
    top: '50%',
    marginTop: -8,
  },
  tallTick: {
    position: 'absolute',
    width: 3,
    height: 80,
    backgroundColor: '#999',
    top: '50%',
    marginTop: -40,
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 56,
    backgroundColor: '#333',
    borderRadius: 4,
    top: '50%',
    marginTop: -28,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#333',
  },
});
