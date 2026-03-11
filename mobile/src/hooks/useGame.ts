import { useState } from "react"
import { Point } from "@/src/core/models/Point"
import { GameEngine } from "@/src/core/engine/GameEngine"

export function useGame(points:Point[]) {

  const [visited,setVisited] = useState<Point[]>([])

  function handleMove(x:number,y:number){

    const point = GameEngine.detectPoint(x,y,points)

    if(!point) return

    setVisited(v=>[...v,point])
  }

  function reset(){
    setVisited([])
  }

  return {
    visited,
    handleMove,
    reset
  }
}
