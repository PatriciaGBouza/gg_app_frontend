


export default class StateTranslation {
    static getState(state:string|any): string|any{
        switch(state){
            case 'Active': return 'Activo';
            case 'Joined': return 'Activo';
            case 'Invited': return 'Invitado'
        }
        return state;
    }
}