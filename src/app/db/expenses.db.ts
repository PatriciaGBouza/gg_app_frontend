import { IExpense } from "../interfaces/iexpense.interface";


export const EXPENSES: IExpense [] = [
    { 
        id: 1,
        group: 
            { 
                id: 1,
                name: 'Familia',
                description: 'Celebramos la abuela cumple 90!',
                createdBy: 1,
                image: "https://placehold.co/200x200",
                createdOn: new Date(),
                participants: [ {id: 54,
                    name: 'Marina Garcia', image: ''}]
            },       
        concept: 'Reserva de la casa rural',
        amount: 150,
        paidBy: 1,
        createdBy: 1,
        expenseDate: new Date(),
        maxDate: new Date(),
        image: "https://placehold.co/200x200",
        createdOn: new Date(),
        expenseStatus:'Paid'
    },
    { 
        id: 2,
        group: 
            { 
                id: 1,
                name: 'Familia',
                description: 'Celebramos la abuela cumple 90!',
                createdBy: 1,
                image: "https://placehold.co/200x200",
                createdOn: new Date(),
                participants: [ {id: 54,
                    name: 'Marina Garcia', image: ''}]
            },       
        concept: 'Regalo',
        amount: 94,
        paidBy: 2,
        createdBy: 1,
        expenseDate: new Date(),
        maxDate: new Date(),
        image: "https://placehold.co/200x200",
        createdOn: new Date(),
        expenseStatus:'Paid'
    }
]