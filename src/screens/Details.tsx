import { useRoute } from "@react-navigation/native";
import { Text, VStack } from "native-base";
import { Header } from "../components/Header";

type RouteParams = {
  orderId: string
}
 
export function Details() {

  const route = useRoute()
  const {orderId} = route.params as RouteParams

  return (
    <VStack flex={1} p={6} bg="gray.600">

      <Header title="Nova solicitação"/>
      <Text color='white'>
        id = {orderId}
      </Text>
    </VStack>
  )
}