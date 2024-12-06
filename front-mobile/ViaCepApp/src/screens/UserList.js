import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../services/api';

const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirmação', 'Deseja realmente deletar este usuário?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Deletar',
        onPress: async () => {
          try {
            await api.delete(`/usuarios/${id}`);
            Alert.alert('Sucesso', 'Usuário deletado com sucesso!');
            fetchUsers();
          } catch (error) {
            Alert.alert('Erro', 'Erro ao deletar usuário.');
            console.error(error);
          }
        },
      },
    ]);
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => toggleExpand(item.id_usuario)}
      activeOpacity={0.8}
    >
      <Text style={styles.name}>{item.nome}</Text>
      {expanded === item.id_usuario && (
        <View style={styles.details}>
          {item.enderecos.map((endereco, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.detailText}>CEP: {endereco.cep}</Text>
              <Text style={styles.detailText}>Número: {endereco.numero}</Text>
              <Text style={styles.detailText}>Logradouro: {endereco.logradouro}</Text>
              <Text style={styles.detailText}>Bairro: {endereco.bairro}</Text>
              <Text style={styles.detailText}>Localidade: {endereco.localidade}</Text>
              <Text style={styles.detailText}>UF: {endereco.uf}</Text>
            </View>
          ))}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => navigation.navigate('UserForm', { userId: item.id_usuario })}
            >
              <Icon name="edit" size={20} color="#fff" />
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => handleDelete(item.id_usuario)}
            >
              <Icon name="delete" size={20} color="#fff" />
              <Text style={styles.buttonText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id_usuario.toString()}
        renderItem={renderUser}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('UserForm')}
        activeOpacity={0.8}
      >
        <Icon name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Cadastrar Usuário</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  listContainer: { paddingBottom: 80 },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  name: { fontSize: 20, fontWeight: 'bold', color: '#444' },
  details: { marginTop: 12 },
  detailItem: { marginBottom: 4 },
  detailText: { fontSize: 16, color: '#555' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default UserList;
