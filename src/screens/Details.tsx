import firestore from "@react-native-firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HStack, Text, VStack, useTheme, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { OrderProps } from "../components/Order";
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import { dateFormat } from "../utils/firestoreDateFormat";

import { CircleWavyCheck, Hourglass, DesktopTower, Clipboard } from "phosphor-react-native"
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string
  solution?: string
  closed: string
}
 
export function Details() {

  const route = useRoute()
  const navigation = useNavigation()
  const { colors } = useTheme()
  const {orderId} = route.params as RouteParams

  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
  const [isLoading, setIsLoading] = useState(true)
  const [solution, setSolution] = useState('')

  function handleOrderClose() {
    if(!solution) {
      return Alert.alert("Solicitação", "Informe a solução para encerrar a solicitação")
    }

    firestore().collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert("Solicitação", "Solicitação encerrada.")
      navigation.goBack()
    })
    .catch((error) => {
      console.log("🚀 ~ handleOrderClose ~ error", error)
      Alert.alert("Solicitação", "Não foi possível encerrar a solicitação.")
    })
  }

  useEffect(() => {
    firestore().collection<OrderFirestoreDTO>('orders')
    .doc(orderId).get()
    .then((doc) => {
      // console.log("🚀 ~ .then ~ doc", doc?._data)
      const {patrimony, description, status, created_at, closed_at, solution} = doc._data

      const closed = closed_at ? dateFormat(closed_at) : null

      setOrder({
        id: orderId,
        patrimony,
        description,
        status,
        when: dateFormat(created_at),
        solution,
        closed
      })

      setIsLoading(false)
    })

  }, [])

  if(isLoading){
    return <Loading/>
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Solicitação"/>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed' ?
            <CircleWavyCheck size={22} color={colors.green[300]}/>
            :
            <Hourglass size={22} color={colors.secondary[700]}/>
        }

        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] :  colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {
            order.status === 'closed' ? 'Finalizado' : 'Em andamento'
          }
        </Text>
      </HStack>
      
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
          <CardDetails 
            title="Equipamento" 
            description={`Patrimônio ${order.patrimony}`}
            icon={DesktopTower}
            
          />

          <CardDetails
            title="Descrição do problema"
            description={order.description}
            icon={Clipboard}
            footer={`Registrado em ${order.when}`}
          />

          <CardDetails
            title="Solução"
            description={order.solution}
            icon={CircleWavyCheck}
            footer={order.closed && `Encerrado em ${order.closed}`}
          >
            {
              order.status === 'open' &&
              <Input
                placeholder="Descrição da solução" 
                onChangeText={setSolution}
                textAlignVertical="top"
                multiline
                h={24}
                // bg="gray.600"
              />
            }
          </CardDetails>
      </ScrollView>
      
      {
        order.status === 'open' && <Button title="Encerrar solicitação" m={5} onPress={handleOrderClose}/>
      }
    </VStack>
  )
}