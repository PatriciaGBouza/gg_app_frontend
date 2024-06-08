import { IGroup } from "../interfaces/igroup.interface";


export const GROUPS: IGroup [] = [
    { 
        id: 1,
        name: 'Familia',
        description: 'Celebramos la abuela cumple 90!',
        createdBy: 1,
        image: "https://placehold.co/200x200",
        createdOn: Date.now()
    },
    { 
        id: 2,
        name: 'Compañeros de EGB',
        description: 'Qué bien lo pasamos',
        createdBy: 1,
        image: '',
        createdOn: Date.now()
    },
    { 
        id: 3,
        name: 'Padel 2024',
        description: 'Padel domingueros 2024',
        createdBy: 1,
        image: '',
        createdOn: Date.now()
    },
    { 
        id: 4,
        name: 'Nuevo grupo',
        description: 'Descr grupo',
        createdBy: 1,
        image: '',
        createdOn: Date.now()
    },
    
    { 
        id: 5,
        name: 'Otro',
        description: 'Otro desc',
        createdBy: 2,
        image: '',
        createdOn: Date.now()
    }
    

]