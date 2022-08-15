import { useNavigation } from "@react-navigation/native";
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from "native-base";
import { SignOut, ChatTeardropText } from "phosphor-react-native"
import { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'



import Logo from "../assets/logo_secondary.svg"
import { Button } from "../components/Button";
import { Filter } from "../components/Filter";
import { Order, OrderProps } from "../components/Order";
import { Alert } from "react-native";
import { dateFormat } from "../utils/firestoreDateFormat";
import { Loading } from "../components/Loading";

export function Home() {

  const {colors} = useTheme()

  const [isLoading, setIsLoading] = useState(true)
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
  const [orders, setOrders] = useState<OrderProps[]>([])

  const navigation = useNavigation()

  function handleNewOrder(){
    navigation.navigate('new')
  }

  function handleOpenDetails(orderId: string){
    navigation.navigate("details", {orderId})
  }

  function handleLogout(){
    auth().signOut().catch(error => {
      console.log("🚀 ~ auth ~ error", error)
      return Alert.alert('Sair', 'Não foi possível sair')
    })
  }


  useEffect(() => {
    setIsLoading(true)

    const subscriber = firestore().collection('orders')
    .where('status', '==', statusSelected)
    .onSnapshot(snapshot => {
      // console.log("🚀 ~ useEffect ~ snapshot", snapshot)
      const data = snapshot.docs.map(doc => {
        // console.log("🚀 ~ useEffect ~ doc", doc)
        const { patrimony, description, status, created_at } = doc._data

        return {
          id: doc.id,
          patrimony,
          description,
          status,
          when: dateFormat(created_at)
        }
      })

      setOrders(data)
      setIsLoading(false)
    })

    return subscriber

  }, [statusSelected])

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      {/* HEADER */}
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >

        <Logo />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>

        {/* TÍTULOS */}
        <HStack 
          w="full" 
          mt={8} 
          mb={4} 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Heading color="gray.100">
            Meus chamados
          </Heading>
          <Text color="gray.200">{orders.length}</Text>
        </HStack>

        {/* FILTROS */}
        <HStack space={2} mb={8}>
          <Filter 
            title="Em andamento" 
            type="open" 
            onPress={() => setStatusSelected('open')} 
            isActive={statusSelected === 'open'}
          />
          
          <Filter 
            title="Finalizados" 
            type="closed" 
            onPress={() => setStatusSelected('closed')} 
            isActive={statusSelected === 'closed'}
          />
        </HStack>

        {/* ELEMENTOS DE LISTA */}

        {
          isLoading ? <Loading/> : 
          <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={({item}) => <Order data={item} onPress={ ()=> handleOpenDetails(item.id) }/>}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40}/>
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Você ainda não possui solicitações {statusSelected === 'open' ? 'abertas' : 'finalizadas'} 
                </Text>
              </Center>
            )}
          />
        }

        <Button title="Nova solicitação" onPress={handleNewOrder}/>
      </VStack>
    </VStack>
  )
}