import React, { useState, useRef } from 'react';
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
  const sliderWidth = 280;
  const tickCount = (max - min) + 1;
  const tickSpacing = sliderWidth / (tickCount - 1);

  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        const normalizedValue = (x / sliderWidth) * (max - min) + min;
        const roundedValue = Math.round(normalizedValue);
        const clampedValue = Math.max(min, Math.min(max, roundedValue));
        onValueChange(clampedValue);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
    })
  ).current;

  const sliderPosition = ((value - min) / (max - min)) * sliderWidth;

  return (
    <View style={styles.container}>
      <View
        style={[styles.sliderTrack, { width: sliderWidth }]}
        {...panResponder.panHandlers}
      >
        {/* Horizontal line */}
        <View style={styles.horizontalLine} />

        {/* Tick marks */}
        {Array.from({ length: tickCount }).map((_, index) => {
          const tickPosition = (index / (tickCount - 1)) * sliderWidth;
        if(index == 0 || index == tickCount - 1) {
            return (
                <View
                key={index}
                style={[
                    styles.tallTick,
                    {
                        right: tickPosition - 1,
                    },
                ]}
                />
            )}
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
        )
        })}
            {/* <View
              style={[
                styles.tallTick,
                {
                  right: sliderWidth /2,
                },
              ]}
            /> */}

        {/* Slider thumb */}
        <View
          style={[
            styles.sliderThumb,
            {
              left: sliderPosition - 8,
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
    marginTop: 16,
  },
  sliderTrack: {
    height: 50,
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 16,
    backgroundColor: '#eaeaea'
  },
  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#999',
    top: '50%',
    marginTop: -1,
  },
  tick: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#999',
    top: '50%',
    marginTop: -5,
  },
  tallTick: {
    position: 'absolute',
    width: 2,
    height: 50,
    backgroundColor: '#999',
    top: '50%',
    marginTop: -25,
  },
  sliderThumb: {
    position: 'absolute',
    width: 16,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 2,
    top: '50%',
    marginTop: -20,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#333',
  },
});
