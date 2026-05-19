import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DestinationSearch from '../screens/DestinationSearch';
import EmailConfirmation from '../screens/EmailConfirmation';
import Login from '../screens/Login';
import PassengerHome from '../screens/PassengerHome';
import Register from '../screens/Register';
import UserTypeSelection from '../screens/UserTypeSelection';
import DriverHome from '../screens/DriverHome';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
        headerShown: false,
      }}
      > 
        {/* TELA DE LOGIN */}
        <Stack.Screen name="Login" component={Login} />

        {/* TELA DE CADASTRO */}
        <Stack.Screen name="Register" component={Register} />

        {/* TELA DE CONFIRMAÇÃO DE EMAIL*/}
        <Stack.Screen
          name="EmailConfirmation"
          component={EmailConfirmation}
        />

        {/* TELA DE SELEÇÃO DE TIPO DE USUÁRIO */}
        <Stack.Screen name="UserTypeSelection" component={UserTypeSelection} />

        {/* TELA DE PASSAGEIRO */}
        <Stack.Screen
          name="PassengerHome"
          component={PassengerHome}
        />
        {/* TELA DE MOTORISTA */}
        <Stack.Screen 
          name="DriverHome" 
          component={DriverHome} 
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="DestinationSearch"
          component={DestinationSearch}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}