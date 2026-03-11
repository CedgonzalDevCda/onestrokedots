import { View,Button } from "react-native"
import { router } from "expo-router"

export default function LevelSelect(){

  return(
    <View style={{flex:1,justifyContent:"center"}}>

      <Button
        title="Level 1"
        onPress={()=>router.push("/play")}
      />

    </View>
  )
}
