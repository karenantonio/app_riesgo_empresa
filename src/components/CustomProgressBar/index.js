import React from 'react';
import { Text} from 'native-base';
import {View,Modal, ActivityIndicator} from 'react-native';
export const CustomProgressBar = ({ visible }) => (
    <Modal onRequestClose={() => null} visible={visible}>
      <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
          <Text style={{ fontSize: 12, fontWeight: '200' }}>Enviando...</Text>
          <ActivityIndicator size="large" />
        </View>
      </View>
    </Modal>
);