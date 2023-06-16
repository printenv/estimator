import { Condition } from "."
import {Estimation} from "./types"
export * from "./types"

const Estimator = {
  checkConditionIndex: (estimation: Estimation, conditionIndex:number)=>{
    if(conditionIndex < 0 || conditionIndex >= estimation.conditions.length){
      throw new Error(`conditionIndex ${conditionIndex} is out of range.`)
    } 
  },

  isConditionEnabled: (condition: Condition):boolean => {
    if("dependency" in condition){
      const dependencyAnswer = condition.dependency?.condition.answer
      const onTrue = condition.dependency?.onTrue ? true : false
      if(onTrue === dependencyAnswer){
        return true
      }else{
        return false
      }
    }
    return true
  },


  updateBoolCondition: (estimation: Estimation, conditionIndex:number) => {
    Estimator.checkConditionIndex(estimation, conditionIndex)
    const condition = estimation.conditions[conditionIndex]
    if(typeof condition.answer !== 'boolean') throw new Error(`updateBoolCondition received an index for a condition not of type BoolCondition`);
    condition.answer = condition.answer ? false : true
  },

  updateNumberCondition: (estimation: Estimation, conditionIndex:number, value:number) => {
    Estimator.checkConditionIndex(estimation, conditionIndex)
    const condition = estimation.conditions[conditionIndex]
    if(typeof condition.answer !== 'number') throw new Error("updateNumberCondition received an index for a condition not of type NumberCondition")
    if(condition.min > value){
      value = condition.min
    }else if(condition.max < value){
      value = condition.max
    }
    condition.answer = value
  },

  resetEstimation: (estimation: Estimation):void => {
    estimation.price = undefined
    estimation.tax = undefined
  },

  calcEstimation: (estimation: Estimation):void => {
    
    let price = estimation.defaultPrice
    for(let i=0; i<estimation.conditions.length; i++){
      const condition = estimation.conditions[i]

      const hasDependency = condition.dependency ? true : false
      const hasPriceAddition = condition.priceAddition !== undefined ? true : false

      if(!hasPriceAddition) continue
      if(hasDependency){
        if(condition.dependency?.condition.answer !== condition.dependency?.onTrue){
          continue
        }
      }

      if(typeof condition.answer === 'boolean'){
        if(condition.answer){
          price += condition.priceAddition ?? 0        
        }
      }else if(typeof condition.answer === 'number'){
        price += (condition.priceAddition ?? 0) * condition.answer
      }
    }


    if(estimation.addDirectionFee){
      price = estimation.addDirectionFee(price)
    }
    estimation.price = price
    estimation.tax = Math.floor(price * estimation.taxPercentage)
  }

}


export default Estimator
