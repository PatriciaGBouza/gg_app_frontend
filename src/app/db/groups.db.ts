import { IGroup } from "../interfaces/igroup.interface";

export const GROUPS: IGroup [] = [
    { 
        id: 1,
        name: 'Familia',
        description: 'Celebramos la abuela cumple 90!',
        createdBy: 1,
        image: "https://placehold.co/200x200",
        createdOn: new Date(),
        participants: [ 
            {id: 53,
            name: 'Leonor Ayala',  email:'',image: ''},
            {id: 54,
            name: 'Marina Garcia', email:'', image: ''},
            {id: 56,
            name: 'Pedro Lopez',  email:'',image: ''},
            {id: 57,
            name: 'Carlos Garcia', email:'', image: ''}
        ]
    },
    { 
        id: 2,
        name: 'Compañeros de EGB',
        description: 'Qué bien lo pasamos',
        createdBy: 1,
        image: '',
        createdOn: new Date(),
        participants: []
    },
    { 
        id: 3,
        name: 'Padel 2024',
        description: 'Padel domingueros 2024',
        createdBy: 1,
        image: '',
        createdOn: new Date(),
        participants: []
    },
    { 
        id: 4,
        name: 'Nuevo grupo',
        description: 'Descr grupo',
        createdBy: 1,
        image: '',
        createdOn: new Date(),
        participants: []
    },
    
    { 
        id: 5,
        name: 'Otro',
        description: 'Otro desc',
        createdBy: 2,
        image: '',
        createdOn: new Date(),
        participants: []
    }
    

]