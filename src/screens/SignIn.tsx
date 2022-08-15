import { useState } from 'react';
import { VStack, Heading, Icon, useTheme } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../assets/logo_primary.svg'
import { Button } from '../components/Button';
import { Input } from '../components/Input'
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

export function SignIn(){

  const { colors } = useTheme()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function handleSignIn() {
    if (!email || !senha){
      return Alert.alert("ENTRAR", "Informe email e senha!")
    }

    setIsLoading(true)

    auth().signInWithEmailAndPassword(email, senha)
    .then((response) => {
      console.log("🚀 ~ .then ~ response", response)
      
    })
    .catch((error) => {
      console.log("🚀 ~ handleSignIn ~ error", error)
      setIsLoading(false)

      if(error.code === 'auth/invalid-email'){
        return Alert.alert("Entrar", "Email inválido")
      }
      if(error.code === 'auth/user-not-found' || error.code == 'auth/wrong-password'){
        return Alert.alert("Entrar", "Email ou senha inválido")
      }
      
      return Alert.alert("Entrar", "Não foi possível acessar") 
    })

  }

  return (
     <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      
      <Logo/>
      
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        SignIn
      </Heading>

      <Input 
        marginBottom={4}
        placeholder="E-mail"
        InputLeftElement={<Icon as = { <Envelope color={colors.gray[300]} /> } ml={4} />}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Input 
        mb={8}
        placeholder="Senha"
        InputLeftElement={<Icon as = { <Key color={colors.gray[300]} /> }ml={4} />}
        secureTextEntry
        onChangeText={setSenha}
      />

      <Button 
        title='Entrar' 
        w="full" 
        onPress={handleSignIn}
        isLoading={isLoading}
      />
     </VStack>
  )
}
