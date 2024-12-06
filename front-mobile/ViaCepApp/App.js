import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserList from './src/screens/UserList';
import UserForm from './src/screens/UserForm';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserList">
        <Stack.Screen name="UserList" component={UserList} options={{ title: 'Usuários' }} />
        <Stack.Screen name="UserForm" component={UserForm} options={{ title: 'Cadastrar Usuário' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
