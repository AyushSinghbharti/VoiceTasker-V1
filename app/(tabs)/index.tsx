import React, { useContext } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskContext from '../providers/TaskProvider';
import Task from '../interface/interface';

export default function TabOneScreen() {
  const taskContext = useContext(TaskContext);

  if (!taskContext) {
    console.error(
      "TaskContext is undefined. Ensure TaskProvider is wrapping your component."
    );
    return null;
  }

  const { tasks, addTask, deleteTask } = taskContext;

  const renderList = ({ item }: { item: Task }) => {
    return (
      <View style={styles.taskItem}>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
          <View style={styles.taskMeta}>
            <Text style={styles.taskMetaText}>{item.date}</Text>
            <Text style={styles.taskMetaText}>{item.time}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(item.id)}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderList}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No tasks available</Text>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          addTask({
            title: "New Task",
            description: "This is a new task.",
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0].slice(0, 5),
            id: tasks.length + 1,
          })
        }
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
    padding: 20,
    paddingBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  taskMeta: {
    flexDirection: 'row',
  },
  taskMetaText: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    margin: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

