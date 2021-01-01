import React, {useEffect, useRef, useState} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import styles from './styles';
const story = {
  uri:
    'https://images.thequint.com/thequint/2020-12/e5c00150-5b50-46b2-80a4-e892ddbe351b/Epkwv0UWMAICMGq.jpg',
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
function DetailsScreen({navigation}) {
  let animation = useRef(new Animated.Value(0));
  const [progress, setProgress] = useState(0);
  useInterval(() => {
    if (progress < 100) {
      setProgress(progress + 1);
    }
  }, 50);
  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 1,
      useNativeDriver: false,
    }).start();
  }, [progress]);
  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });
  useEffect(() => {
    if (progress >= 100) {
      navigation.goBack();
    }
  }, [navigation, progress]);
  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: '#2c405a'}}>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={
              ([StyleSheet.absoluteFill], {backgroundColor: 'white', width})
            }
          />
        </View>
      </View>
      <Image source={story} style={styles.story} />
      <Text
        style={{
          fontSize: 30,
          margin: 20,
          marginTop: 35,
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}>
        Indian batting line up collapses for 36 runs
      </Text>
      <Text style={{fontSize: 40, textAlign: 'center'}}>😢 😢 😢</Text>
    </View>
  );
}
export default DetailsScreen;
