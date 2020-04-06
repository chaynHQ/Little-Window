/*
 * action types
 */
export const ADD_USER_INPUT = 'ADD_USER_INPUT';
export const ADD_BOT_MESSAGE = 'ADD_BOT_MESSAGE';
export const UPDATE_BOT_MESSAGE = 'UPDATE_BOT_MESSAGE';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_CONVERSATION_DATA = 'SET_CONVERSATION_DATA';
export const REFRESH_CONVERSATION = 'REFRESH_CONVERSATION';
export const SET_MINIMISE_STATE = 'SET_MINIMISE_STATE';

/*
 * action creators
 */
export const addUserInputToStack = (text) => ({
  type: ADD_USER_INPUT,
  text,
});

export const fetchBotResponseSuccess = (data) => ({
  type: ADD_BOT_MESSAGE,
  data,
});

export const fetchBotResponseFailure = (errorMessage) => ({
  type: UPDATE_BOT_MESSAGE,
  errorMessage,
});

export const updateBotMessage = (data) => ({
  type: UPDATE_BOT_MESSAGE,
  data,
});

export const updateConversation = (data) => ({
  type: SET_CONVERSATION_DATA,
  data,
});

export const refreshConversation = () => ({
  type: REFRESH_CONVERSATION,
});

export const setMinimiseState = () => ({
  type: SET_MINIMISE_STATE,
});

export const setLanguage = (lang) => ({
  type: SET_LANGUAGE,
  lang,
});

/*
 * action functions
 */
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function sendToServer(data) {
  return fetch('/usermessage', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  })
    .then(handleErrors)
    .then((res) => res.json());
}

export function fetchBotResponse(data) {
  return (dispatch) => sendToServer(data)
    .then((json) => {
      dispatch(fetchBotResponseSuccess(json));
      return json;
    })
    .catch(() => dispatch(
      fetchBotResponseFailure("I'm really sorry but I can't chat right now due to technical problems, please check the Chayn website for any information you are looking for or try again later"),
    ));
}
