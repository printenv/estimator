export interface Dependency {
    condition:BoolCondition,
    onTrue: boolean
  }
  
  interface ConditionTemplate {
    question: string,
    description?: string,
    priceAddition?: number,
    dependency? : Dependency
  }
  
  export interface BoolCondition extends ConditionTemplate{
    answer: boolean
  }
  
  export interface NumberCondition extends ConditionTemplate{
    answer: number
    min: number
    max: number
    priceAddition: number
  }
  
  export type Condition = BoolCondition | NumberCondition
  type Conditions = Condition[]
  
  export interface Estimation {
    title: string,
    defaultPrice: number,
    conditions: Conditions,
    price:number | undefined
    tax:number | undefined
    taxPercentage:number
  }