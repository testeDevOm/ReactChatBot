import { ApiAiClient } from 'api-ai-javascript';
import { applyMiddleware, createStore } from 'redux';

//const accessToken = 'b7697a85218b46aa9d4455ed401c9610  ';
/*
* Uncomment the line above and comment the line below
* to have access to a database in English
* Default db is in PT-BR
*/
const accessToken = 'bf8d35852f6a4e749b18624dd8b23b0d';

const client = new ApiAiClient({ accessToken });

const ON_MESSAGE = 'ON_MESSAGE';

export const sendMessage = (text, sender = 'user') => ({
    type: ON_MESSAGE,
    payload : {
        text, sender
    }
});

const messageMiddleware = () => next => action => {
    next(action)
    
    if (action.type === ON_MESSAGE){
        const { text } = action.payload;
        
        client.textRequest(text)
        .then( onSuccess )
        
        function onSuccess( response ){
            const { result: {fulfillment }} = response;
            next(sendMessage(fulfillment.speech, 'bot'));
        }
    }
};

const messageReducer = (state = [], action) => {
    switch (action.type){
        
        case ON_MESSAGE:
            return [ ...state, action.payload ];

        default:
            return state;
    }
};

export const store = createStore(messageReducer, applyMiddleware(messageMiddleware));