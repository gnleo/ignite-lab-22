// arquivo que faz a separação da tipagem do que o fireStore entrega para a aplicação
// Data Transfer

import {FirebaseFirestoreTypes} from "@react-native-firebase/firestore"

export type OrderFirestoreDTO = {
  patrimony: string
  description: string
  status: 'open' | 'closed'
  solution?: string
  created_at: FirebaseFirestoreTypes.Timestamp
  closed_at?: FirebaseFirestoreTypes.Timestamp
}