import { ReactNode, createContext, useState, useReducer, useEffect } from "react";

import { Cycle, cyclesReducer} from "../reducers/cycles/reducer"
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
    task: string
    minutesAmount: number
}
interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string  | null
    markCurrentCycleAsFinished: () => void
    amountSecondsPassed: number
    setSecondsPassed : (seconds : number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void

}
export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    const [ cyclesState, dispatch ] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    },
     (initialState) => {
        const storedStateAsJson = localStorage.getItem(
            '@ignite-timer:cycles-state-1.0.0'
        )

        if(storedStateAsJson) {
            return JSON.parse(storedStateAsJson)
        }

        return initialState
    },)

    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if(activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }

        return 0
    });

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
    }, [cyclesState])

    

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {

        dispatch(markCurrentCycleAsFinishedAction)

    }  

    function createNewCycle(data: CreateCycleData){
        const id =String(new Date().getTime());

        const newCycle : Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))

    }

    function interruptCurrentCycle() {

        dispatch(interruptCurrentCycleAction())

    }
    
    return (
        <CyclesContext.Provider 
                value={{
                    cycles,
                    activeCycle, 
                    activeCycleId, 
                    markCurrentCycleAsFinished, 
                    amountSecondsPassed, 
                    setSecondsPassed,
                    createNewCycle, 
                    interruptCurrentCycle
                    }}
                >
                    { children }

                </CyclesContext.Provider>
    )
}