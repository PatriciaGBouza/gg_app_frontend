import { IExpense } from "../interfaces/iexpense.interface";





export const EXPENSES: IExpense [] = [{
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
    amount: 78,
    paidBy: 1,
    createdBy: 1,
    expenseDate: new Date(),
    maxDate: new Date(),
    image: "https://placehold.co/200x200",
    createdOn: new Date(),
    expenseStatus:'Reported',
    participants: [
    { 
        
        idParticipant: 53,
        participantName: 'Leonor Ayala',
        participantImage:'',
        percentage: 0.5,
        amount:34,
        expenseStatus:'Reported'
    },
    { 
        idParticipant: 54,
        participantName: 'Marina Garcia',
        participantImage:'',
        percentage: 0.5,
        amount:34,
        expenseStatus:'Reported'
    },
    { 
        idParticipant: 56,
        participantName: 'Pedro Lopez',
        participantImage:'',
        percentage: 0,
        amount:0
    },
    { 
        idParticipant: 57,
        participantName: 'Carlos Garcia',
        participantImage:'',
        percentage: 0.0,
        amount:0
    }]
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
    amount: 30,
    paidBy: 2,
    createdBy: 1,
    expenseDate: new Date(),
    maxDate: new Date(),
    image: "https://placehold.co/200x200",
    createdOn:new Date(),
    expenseStatus:'Paid',
    participants: [
    { 
        
        idParticipant: 53,
        participantName: 'Leonor Ayala',
        participantImage:'',
        percentage: 0.333,
        amount:10,
        expenseStatus:'Accepted'
    },
    { 
        idParticipant: 54,
        participantName: 'Marina Garcia',
        participantImage:'',
        percentage: 0.333,
        amount:10,
        expenseStatus:'Accepted'
    },
    { 
        idParticipant: 56,
        participantName: 'Pedro Lopez',
        participantImage:'',
        percentage: 0.333,
        amount:10,
        expenseStatus:'Accepted'
    },
    { 
        idParticipant: 57,
        participantName: 'Carlos Garcia',
        participantImage:'',
        percentage: 0.0,
        amount:0,
    }]
},
{
    id: 3,
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
    concept: 'Decoracion',
    amount: 30,
    paidBy: 2,
    createdBy: 1,
    expenseDate: new Date(),
    maxDate: new Date(),
    image: "https://placehold.co/200x200",
    createdOn:new Date(),
    expenseStatus:'Paid',
    participants: [
    { 
        
        idParticipant: 53,
        participantName: 'Leonor Ayala',
        participantImage:'',
        percentage: 0.40,
        amount:15,
        expenseStatus:'Paid'
    },
    { 
        idParticipant: 54,
        participantName: 'Marina Garcia',
        participantImage:'',
        percentage: 0.20,
        amount:7.5,
        expenseStatus:'Paid'
    },
    { 
        idParticipant: 56,
        participantName: 'Pedro Lopez',
        participantImage:'',
        percentage: 0.2,
        amount:7.5,
        expenseStatus:'Paid'
    },
    { 
        idParticipant: 57,
        participantName: 'Carlos Garcia',
        participantImage:'',
        percentage: 0.2,
        amount:7.5,
        expenseStatus:'Paid'
    }]
}


]
