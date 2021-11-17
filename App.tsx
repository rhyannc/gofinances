import { StatusBar } from 'react-native';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

 
import {
    useFonts,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
} from '@expo-google-fonts/poppins';
import theme from './src/global/styles/theme';

import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/components/routes/app.routes';


import { SignIn } from './src/screens/SignIn';

import { AuthProvider } from './src/hooks/auth';


export default function App() { 
   //Vai garantir o carregamento da fonte 
   const [fontsLoaded] = useFonts({Poppins_400Regular, Poppins_500Medium, Poppins_700Bold});

   //segurar o aparelho na tela de splash em quanto as fontes nao forem baixadas
   if(!fontsLoaded){
     return<AppLoading/>
   }

  return (
  <ThemeProvider theme={theme}> 
    <NavigationContainer>
    <StatusBar 
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
    <AuthProvider>
      <SignIn />
    </AuthProvider>

    </NavigationContainer>
  </ThemeProvider>
  )
}

