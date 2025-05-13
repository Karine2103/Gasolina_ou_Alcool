import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ImageBackground, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [alcool, setAlcool] = useState('');
  const [gasolina, setGasolina] = useState('');
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  

  const calcularVantagem = () => {
    if (alcool && gasolina) {
      const resultadoCalculado = (parseFloat(alcool) / parseFloat(gasolina)) <= 0.7;
      setResultado(resultadoCalculado);
      salvarHistorico(alcool, gasolina, resultadoCalculado);
    }
  };

  const salvarHistorico = async (alcool, gasolina, resultado) => {
    const novoHistorico = {
      alcool,
      gasolina,
      resultado: resultado ? 'Álcool é melhor' : 'Gasolina é melhor',
      data: new Date().toLocaleString(),
    };
    const novoHistoricoList = [novoHistorico, ...historico];
    setHistorico(novoHistoricoList);
    await AsyncStorage.setItem('historico', JSON.stringify(novoHistoricoList));
  };

 
  useEffect(() => {
    const carregarHistorico = async () => {
      const historicoSalvo = await AsyncStorage.getItem('historico');
      if (historicoSalvo) {
        setHistorico(JSON.parse(historicoSalvo));
      }
    };
    carregarHistorico();
  }, []);

 
  const limparHistorico = async () => {
    setHistorico([]);
    await AsyncStorage.removeItem('historico');
  };

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.container}>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Álcool (R$)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={alcool}
              onChangeText={setAlcool}
            />

            <Text style={styles.label}>Gasolina (R$)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={gasolina}
              onChangeText={setGasolina}
            />

            <TouchableOpacity style={styles.button} onPress={calcularVantagem}>
              <Text style={styles.buttonText}>Calcular</Text>
            </TouchableOpacity>

            {resultado !== null && (
              <Text style={styles.resultText}>
                O melhor combustível é: {resultado ? 'Álcool' : 'Gasolina'}
              </Text>
            )}

            <TouchableOpacity style={styles.clearButton} onPress={limparHistorico}>
              <Text style={styles.clearButtonText}>Limpar Histórico</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>Ver Histórico</Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Histórico de Cálculos</Text>
                  {historico.length > 0 ? (
                    <FlatList
                      data={historico}
                      renderItem={({ item }) => (
                        <View style={styles.historyItem}>
                          <Text style={styles.historyText}>
                            Álcool: {item.alcool} | Gasolina: {item.gasolina}
                          </Text>
                          <Text style={styles.historyText}>{item.resultado}</Text>
                          <Text style={styles.historyText}>Data: {item.data}</Text>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  ) : (
                    <Text style={styles.emptyHistory}>Nenhum histórico disponível.</Text>
                  )}
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(37, 0, 24, 0.3)',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: 'rgba(72, 3, 47, 0.55)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    borderColor: '#0000FF',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
    fontFamily: 'Courier New',
    color: '#000',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#290404',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.66)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#290404',
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
    elevation: 3,
    color:'pink',
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    backgroundColor: 'rgba(64, 0, 42, 0.8)',
    padding: 8,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  historyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#290404',
  },
  historyText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 3,
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
});
