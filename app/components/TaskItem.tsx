import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Task from '../interface/interface';

interface TaskItemProps {
  index: number;
  task: Task;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ index, task, onDelete, onToggleComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: index < 6 ? 500*index : 0,
      useNativeDriver: true,
    }).start();
  }, []);

  const onGestureEvent = Animated.event<PanGestureHandlerGestureEvent>(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.oldState === 4) {
      const { translationX } = event.nativeEvent;
      if (translationX < -100) {
        onDelete(task.id);
      } else if (translationX > 100) {
        onToggleComplete(task.id);
      }
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const interpolatedTranslateX = translateX.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [-80, 0, 80],
    extrapolate: 'clamp',
  });

  const interpolatedOpacityLeft = translateX.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const interpolatedOpacityRight = translateX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, { opacity: interpolatedOpacityLeft }]}>
        <View style={[styles.action, styles.leftAction]}>
          <MaterialCommunityIcons
            name={task.completed ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}
            size={24}
            color="#fff"
          />
        </View>
      </Animated.View>
      <Animated.View style={[styles.background, { opacity: interpolatedOpacityRight }]}>
        <View style={[styles.action, styles.rightAction]}>
          <MaterialCommunityIcons name="delete-outline" size={24} color="#fff" />
        </View>
      </Animated.View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={[
          styles.foreground,
          { opacity: fadeAnim, transform: [{ translateX: interpolatedTranslateX }] }
        ]}>
          <TouchableOpacity onPress={() => onToggleComplete(task.id)}>
            <View style={styles.taskContent}>
              <View style={styles.taskHeader}>
                <MaterialCommunityIcons
                  name={task.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                  size={24}
                  color={task.completed ? "#4CAF50" : "#757575"}
                />
                <Text style={[styles.taskTitle, task.completed && styles.completedTask]}>{task.title}</Text>
              </View>
              <Text style={styles.taskDescription}>{task.description}</Text>
              <View style={styles.taskMeta}>
                <MaterialCommunityIcons name="calendar" size={16} color="#757575" />
                <Text style={styles.taskMetaText}>{task.date}</Text>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#757575" />
                <Text style={styles.taskMetaText}>{task.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    height: 120,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  foreground: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: '100%',
  },
  action: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftAction: {
    backgroundColor: '#E3F2FD',
  },
  rightAction: {
    backgroundColor: '#FF3B30',
  },
  taskContent: {
    padding: 16,
    height: '100%',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskMetaText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
    marginRight: 12,
  },
});

export default TaskItem;