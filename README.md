# About
This is a set of functions and types intended to make simple estimation in client side.

## Installation
```bash
npm i @printenv/estimator
```
## Estimator
Estimator consist of functions to manipulate objects of type Estimation.<br />There are two main types:
- Condition
- Estimation

### Condition Type
Estimator can update properties of conditions so that user can meet their needs.
Condition(s) in Estimation are used in methods of Estimator to calculate its price.
``` typescript
export interface Dependency {
    condition:BoolCondition,
    onTrue: boolean
}

  
interface ConditionTemplate {
  question: string
  description?: string
  priceAddition?: number
  serviceTitle?: string
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
```

### Estimation Type
``` typescript
export interface Estimation {
  title: string
  defaultPrice: number
  conditions: Conditions
  addDirectionFee?: (price:number) => number
  price:number | undefined
  tax:number | undefined
  taxPercentage:number
}
```


## Functions defined in Estimator

 - checkConditionIndex: (estimation: Estimation, conditionIndex:number):void
 - isConditionEnabled: (condition: Condition):boolean 
 - updateBoolCondition: (estimation: Estimation, conditionIndex:number):void
 - updateNumberCondition: (estimation: Estimation, conditionIndex:number, value:number):void
 - calcEstimation: (estimation: Estimation):void

## Usage Example with React
``` jsx
import React, { useEffect, useState } from 'react';
import './App.css';

import Estimator, {Estimation, Condition, BoolCondition, NumberCondition} from "package_test"


function App() {

  const c1:BoolCondition = {
    question: "Want some options?",
    answer: false
  }
  const c2: NumberCondition = {
    question: "how many",
    answer: 1,
    min: 1,
    max: 5,
    dependency: {
      condition: c1,
      onTrue: true
    },
    priceAddition: 500
  }

  const [estimation, setEstimation] = useState<Estimation>({
    title:"Estimation Demo",
    defaultPrice:1000,
    conditions: [c1, c2],
    price: undefined,
    tax: undefined,
    taxPercentage: 0.1
  })

  const toggleRadio = (e:React.ChangeEvent<HTMLInputElement>) => {
    const newEstimation = {...estimation}
    Estimator.updateBoolCondition(newEstimation, Number(e.target.value))
    setEstimation(newEstimation)
  }

  const updateNumber = (i:number, increase:boolean) => {
    const newEstimation: Estimation = {...estimation}
    const addition = increase ? 1 : -1
    const newValue = Number(newEstimation.conditions[i].answer) + addition
    Estimator.updateNumberCondition(newEstimation, i, newValue)
    setEstimation(newEstimation)
  }

  const estimate = () => {
    const newEstimation = {...estimation}
    Estimator.calcEstimation(newEstimation)
    setEstimation(newEstimation)
  }

  
  return (
    <div className="App">
      <header className="App-header">
        <h2>{estimation.title}</h2>
        {estimation.conditions.map((condition, i) => {
          if(Estimator.isConditionEnabled(condition)){
            if(typeof condition.answer === 'boolean'){
              return (
                <label>
                  {condition.question}
                  <input type="checkbox" checked={condition.answer ? true : false} value={i} onChange={toggleRadio} />
                </label>
              )
            }else if(typeof condition.answer === "number"){
              return (
                <>
                  <h4>{condition.question}</h4>
                  <div style={{
                    display:"flex",
                    alignItems: "center"
                  }}>
                    <button onClick={()=>updateNumber(i, false)}>-</button>
                      <p style={{
                        fontSize: "12px",
                        margin: "2rem 1rem"
                      }}>{condition.answer}</p>
                    <button onClick={()=>updateNumber(i, true)}>+</button>
                  </div>
                </>
              )
            }
          }
        })}
        {(estimation.price !== undefined && estimation.tax !== undefined) &&
          <h3>Price: {estimation.price + estimation.tax}</h3>
        }
        <button onClick={estimate}>Estimate</button>
      </header>
    </div>
  );
}

export default App;

```