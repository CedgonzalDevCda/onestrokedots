import { Stack } from "expo-router"

export default function Layout(){

  return(
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="(game)/worlds"/>
      <Stack.Screen name="(game)/levels"/>
      <Stack.Screen name="(game)/play"/>
    </Stack>
  )
}
