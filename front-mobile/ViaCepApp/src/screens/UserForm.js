import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../services/api';

const UserForm = ({ route, navigation }) => {
  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [localidade, setLocalidade] = useState('');
  const [uf, setUf] = useState('');

  const { userId } = route.params || {};

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const fetchUser = async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      const user = response.data;

      setNome(user.nome);
      if (user.enderecos.length > 0) {
        const endereco = user.enderecos[0];
        setCep(endereco.cep || '');
        setNumero(endereco.numero || '');
        setLogradouro(endereco.logradouro || '');
        setBairro(endereco.bairro || '');
        setLocalidade(endereco.localidade || '');
        setUf(endereco.uf || '');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar os dados do usuário.');
      console.error(error);
    }
  };

  const fetchCepData = async (cepValue) => {
    setCep(cepValue);

    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await api.get(`/enderecos/consulta-cep/${cleanCep}`);
        const endereco = response.data;

        if (endereco) {
          setLogradouro(endereco.logradouro || '');
          setBairro(endereco.bairro || '');
          setLocalidade(endereco.localidade || '');
          setUf(endereco.uf || '');
        } else {
          Alert.alert('Erro', 'CEP não encontrado.');
        }
      } catch (error) {
        Alert.alert('Erro', 'Erro ao consultar o CEP.');
        console.error(error);
      }
    }
  };

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erro', 'Permissão para acessar localização foi negada.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await api.post('/enderecos/geolocalizacao', {
        lat: latitude,
        lng: longitude,
      });
      const endereco = response.data;

      if (endereco) {
        setCep(endereco.cep || '');
        setLogradouro(endereco.logradouro || '');
        setBairro(endereco.bairro || '');
        setLocalidade(endereco.localidade || '');
        setUf(endereco.uf || '');
      } else {
        Alert.alert('Erro', 'Não foi possível obter o endereço com a localização.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao obter localização.');
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        nome,
        enderecos: [
          {
            cep,
            numero,
            logradouro,
            bairro,
            localidade,
            uf,
          },
        ],
      };

      if (userId) {
        await api.put(`/usuarios/${userId}`, payload);
        Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      } else {
        await api.post('/usuarios', payload);
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar os dados do usuário.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.gpsButton} onPress={fetchLocation}>
        <Icon name="map-marker-radius" size={20} color="#fff" />
        <Text style={styles.gpsButtonText}> Ativar GPS</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{userId ? 'Editar Usuário' : 'Cadastrar Usuário'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do usuário"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={cep}
        onChangeText={fetchCepData}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Número"
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Logradouro"
        value={logradouro}
        onChangeText={setLogradouro}
      />
      <TextInput
        style={styles.input}
        placeholder="Bairro"
        value={bairro}
        onChangeText={setBairro}
      />
      <TextInput
        style={styles.input}
        placeholder="Localidade"
        value={localidade}
        onChangeText={setLocalidade}
      />
      <TextInput
        style={styles.input}
        placeholder="UF"
        value={uf}
        onChangeText={setUf}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Icon name="content-save" size={20} color="#fff" />
        <Text style={styles.buttonText}> Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  gpsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default UserForm;
