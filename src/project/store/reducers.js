


export const nameReducer = (state="p",action,label) =>{
    switch (action.type){
        case label:
            return action.value;
        default:
            return state;
    }
}

export default {nameReducer}