import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TaskContext from "../providers/TaskProvider";
import TaskItem from "../components/TaskItem";
import FloatingActionButton from "../components/FloatingActionButton";
import Task from "../interface/interface";
import useMainBackend from "../backend/mainBackend";

export default function index() {
  const taskContext = useContext(TaskContext);

  if (!taskContext) {
    console.error(
      "TaskContext is undefined. Ensure TaskProvider is wrapping your component."
    );
    return null;
  }

  const { tasks, addTask, deleteTask } = taskContext;
  const { startRecording, stopRecording, recording, task } = useMainBackend();

  const toggleTaskComplete = (id: number) => {
    taskContext.toggleTaskComplete(id);
  };

  const renderItem = ({ item, index }: { item: Task; index: number }) => (
    <TaskItem
      index={index}
      task={item}
      onDelete={deleteTask}
      onToggleComplete={toggleTaskComplete}
    />
  );

  const toggleRecording = () => {
    if (recording) {
      stopRecording();

      //task is in the format of [{t1}, {t2}, {t3}]
      // addTask(task); Execute this function in proper way
    } else {
      startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>{tasks.length} tasks</Text>
        </View>
        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks available</Text>
            <Text style={styles.emptySubtext}>
              Add a new task to get started!
            </Text>
          </View>
        )}
      </LinearGradient>
      <FloatingActionButton onPress={toggleRecording} isRec={!!recording} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
});
