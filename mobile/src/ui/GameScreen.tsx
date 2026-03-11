import { View } from "react-native"
import Svg, { Circle, Text } from "react-native-svg"
import { Point } from "@/src/core/models/Point"
import { useGame } from "@/src/hooks/useGame"
import { Validator } from "@/src/core/engine/Validator"

const levelPoints:Point[] = [
  {id:"1",x:80,y:120,value:2,radius:30},
  {id:"2",x:250,y:120,value:1,radius:30},
  {id:"3",x:160,y:300,value:2,radius:30}
]

export default function GameScreen(){

  const {visited,handleMove} = useGame(levelPoints)

  function handleTouch(e:any){

    const {locationX,locationY} = e.nativeEvent

    handleMove(locationX,locationY)

    if(Validator.validate(levelPoints,visited)){
      console.log("LEVEL COMPLETED")
    }

  }

  return(

    <View 
      style={{flex:1}}
      onTouchMove={handleTouch}
    >

      <Svg width="100%" height="100%">

        {levelPoints.map(p=>(
          <>
          <Circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.radius}
            stroke="black"
            strokeWidth={3}
            fill="white"
          />

          <Text
            x={p.x}
            y={p.y}
            fontSize="20"
            fill="black"
            textAnchor="middle"
          >
            {p.value}
          </Text>
          </>
        ))}

      </Svg>

    </View>
  )
}
