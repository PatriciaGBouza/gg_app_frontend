


export default class StateTranslation {
    static getState(state:string|any): string|any{
        switch(state){
            case 'Active': return 'Activo';
            case 'Joined': return 'Unido';
            case 'Invited': return 'Invitado'
        }
        return state;
    }
}