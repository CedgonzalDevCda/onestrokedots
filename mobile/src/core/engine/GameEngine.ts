import { Point } from "@/src/core/models/Point"

export class GameEngine {

  static detectPoint(x:number,y:number,points:Point[]){
    
    for(const p of points){
      const dx = x - p.x
      const dy = y - p.y

      const distance = Math.sqrt(dx*dx + dy*dy)

      if(distance <= p.radius){
        return p
      }
    }

    return null
  }

}
