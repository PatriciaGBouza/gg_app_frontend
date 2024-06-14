import { IExpenseParticipant } from "../interfaces/iexpense.interface";




export const PARTICIPANTS_TREEDATA: any [] = [
    {
         key: '53',
         label: 'Leonor Ayala',
         data: 'Leonorrr Ayala',
         icon: '',
         children: []
     },
     {
         key: '54',
         label: 'Marina Garcia',
         data: 'Marina Garcia',
         icon: '',
         children: [
         ]
     },
     {
        key:  '55',
        label: 'Other Person',
        data: 'Other Person',
        icon: '',
        children: [
        ]
    },
    {
        key:'56',
        label: 'Pedro Lopez',
        data: 'Pedro Lopez',
        icon: '',
        children: [
        ]
    }, {
        key: '57',
        label: 'Carlos Garcia',
        data: 'Carlos Garcia',
        icon: '',
        children: [
        ]
    },
    {
        key: '58',
        label: 'Emilio Fernandez',
        data: 'Emilio Fernandez',
        icon: '',
        children: [
        ]
    }
    
 ];

 export const PARTICIPANTS_INAGRUP: IExpenseParticipant [] = [
    { 
        
        idParticipant: 53,
        participantName: 'Leonor Ayala',
        participantImage:'',
        percentage: 0.25,
        amount:0
    },
    { 
        idParticipant: 54,
        participantName: 'Marina Garcia',
        participantImage:'',
        percentage: 0.25,
        amount:0
      
    },
    { 
        idParticipant: 56,
        participantName: 'Pedro Lopez',
        participantImage:'',
        percentage: 0.25,
        amount:0
    },
    { 
        idParticipant: 57,
        participantName: 'Carlos Garcia',
        participantImage:'',
        percentage: 0.25,
        amount:0
    }
 ];