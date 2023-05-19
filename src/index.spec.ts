import {it, describe, beforeEach, expect} from "vitest"
import Estimator from "./index"
import { Estimation, Condition, BoolCondition, NumberCondition } from "./types"

describe("Estimator", ()=> {

    const condition1 : BoolCondition = {
        question: "Would you like to see NumberCondition next?",
        description: "Condition for dependency.",
        answer: false,
    }

    const condition2 : NumberCondition = {
        question: "How many quantity?",
        answer: 1,
        priceAddition: 1000,
        dependency: {
            condition: condition1, 
            onTrue: true
        },
        min: 1,
        max: 5
    }

    const defaultConditions: Condition[] = [
        condition1, condition2            
    ]

    const defaultEstimation: Estimation = {
        title:"Sample Estimation",
        defaultPrice: 0,
        conditions: defaultConditions,
        price: undefined,
        tax: undefined,
        taxPercentage: 0.1
    }

    let estimation :Estimation
    beforeEach(()=>{
        estimation = {...defaultEstimation}
    })

    it("Can throws an error if index that is out of range for estimator.conditions is received.", () => {
        //Arrange
        const badIndex1 = -1
        const badIndex2 = estimation.conditions.length
        
        //Act
        const test1 = () => {
            Estimator.checkConditionIndex(estimation, badIndex1)
        }
        const test2 = () => {
            Estimator.checkConditionIndex(estimation, badIndex2)
        }

        //Assert
        expect(test1).toThrowError()
        expect(test2).toThrowError()
    })

    it("Can throws an error if wrong condition type is selected by conditionIndex passed to functions that updadates conditions.", ()=>{
        //Arrange
        const boolConditionIndex = 0
        const numberConditionIndex = 1
        
        //Act
        const test1 = () => {
            Estimator.updateBoolCondition(estimation, numberConditionIndex)
        }
        const test2 = () => {
            Estimator.updateNumberCondition(estimation, boolConditionIndex, condition2.max)
        }
        expect(test1).toThrowError()
        expect(test2).toThrowError()
    })

    it("Can update condition specified as dependency with consistencty.", ()=>{
        //Arrange
        const boolConditionIndex = 0
        const dependentNumberConditionIndex = 1

        const originalAnswer = estimation.conditions[boolConditionIndex].answer
        const dependentCondition = estimation.conditions[dependentNumberConditionIndex]

        //Act (update dependency)
        Estimator.updateBoolCondition(estimation, boolConditionIndex)

        //Assert
        expect(originalAnswer).toEqual(!dependentCondition.answer)

    })

})