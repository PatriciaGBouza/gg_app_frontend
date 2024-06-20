import { IParticipant } from "../interfaces/iparticipant.interface";

export const PARTICIPANTS_CONTACTSOFAUSER: IParticipant [] = [
    {id: 53,
       name: 'Leonor Ayala', email:'', image: ''},
       {id: 54,
       name: 'Marina Garcia', email:'', image: ''},
       {id: 56,
       name: 'Pedro Lopez',  email:'',image: ''},
       {id: 57,
       name: 'Carlos Garcia',  email:'',image: ''},
       {id: 58,
        name: 'Emilio Fernandez',  email:'',image: ''} ]


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


 export const PARTICIPANTS_INAGROUP: IParticipant [] = [
 {id: 53,
    name: 'Leonor Ayala',  email:'',image: ''},
    {id: 54,
    name: 'Marina Garcia',  email:'',image: ''},
    {id: 56,
    name: 'Pedro Lopez',  email:'',image: ''},
    {id: 57,
    name: 'Carlos Garcia',  email:'',image: ''}
    ]
 