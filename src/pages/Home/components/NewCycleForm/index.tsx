import { useForm, useFormContext } from 'react-hook-form';
import {FormContainer, TaskInput, MinutesAmountInput} from './styles';

import * as zod from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { CyclesContext } from '../../../../contexts/CyclesContext';




export function NewCycleForm() {

    const {activeCycle} = useContext(CyclesContext);
    const {register} = useFormContext();
    
    return (
        <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                    id="task" 
                    list="task-suggestions" 
                    placeholder="Dê um nome para seu projeto "
                    disabled={!!activeCycle}
                    {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1"></option>
                        <option value="Projeto 2"></option>
                        <option value="Projeto 3"></option>
                        <option value="Banana"></option>
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput 
                    type="number" 
                    id="minutesAmount" 
                    step={5}
                    min={5}
                    max={60}
                    {...register('minutesAmount', {valueAsNumber: true})}
                    disabled={!!activeCycle}

                    />

                    <span>minutos.</span>
                </FormContainer>
    )
}