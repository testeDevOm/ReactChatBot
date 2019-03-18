import { ApiAiClient } from './api-ai-javascript';
import { applyMiddleware, createStore } from 'redux';


const accessToken = '337d1916fa024acaab1fc7c4954a4e3c';

const client = new ApiAiClient({ accessToken });

const ON_MESSAGE = 'ON_MESSAGE';

export const sendMessage = (text, sender = 'user', audio, src) => ({
    type: ON_MESSAGE,
    payload: {
        text, sender, id : createUUID(), src : audio ? src : null
    }
});

const createUUID = () => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r && 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const messageMiddleware = () => next => action => {
    next(action)

    if (action.type === ON_MESSAGE) {
        const { text } = action.payload;
        client.textRequest(text)
            .then(onSuccess)
        function onSuccess(response) {
            const { result: { fulfillment } } = response;
            if (fulfillment.messages[1] &&  fulfillment.messages[1].payload.audio) {
                next(sendMessage(fulfillment.speech, 'bot', true, fulfillment.messages[1].payload.src));
                return;
            }
            next(sendMessage(fulfillment.speech, 'bot', false, ''));
        }
    }
};

const messageReducer = (state = [], action) => {
    switch (action.type) {

        case ON_MESSAGE:
            return [...state, action.payload];

        default:
            return state;
    }
};

export const store = createStore(messageReducer, applyMiddleware(messageMiddleware));