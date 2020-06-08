import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock-jest';
import getNewConversationMessage from '../storyblok';

import {
  ADD_USER_INPUT,
  ADD_BOT_MESSAGE,
  SET_LANGUAGE,
  UPDATE_BOT_MESSAGE,
  SET_CONVERSATION_DATA,
  REFRESH_CONVERSATION,
  SET_MINIMISE_STATE,
  addUserInputToStack,
  fetchBotResponseSuccess,
  fetchBotResponseFailure,
  updateBotMessage,
  updateConversation,
  refreshConversation,
  setMinimiseState,
  setLanguage,
  fetchBotResponse,
  startNewConversation,
} from '../actions';

jest.mock('../storyblok.js');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('non-async actions', () => {
  it('should create an action to add a user input to the stack', () => {
    const text = 'Lorum Ipsum';
    const expectedAction = {
      type: ADD_USER_INPUT,
      text,
    };

    expect(addUserInputToStack(text)).toEqual(expectedAction);
  });

  it('should create an action to add a user bot to stack on success', () => {
    const data = {};
    const expectedAction = {
      type: ADD_BOT_MESSAGE,
      data,
    };
    expect(fetchBotResponseSuccess(data)).toEqual(expectedAction);
  });

  it('should create an action to add a user bot to stack on failure', () => {
    const data = {};
    const expectedAction = {
      type: ADD_BOT_MESSAGE,
      data,
    };
    expect(fetchBotResponseFailure(data)).toEqual(expectedAction);
  });

  it('should create an action to update a bot message', () => {
    const data = {};
    const expectedAction = {
      type: UPDATE_BOT_MESSAGE,
      data,
    };
    expect(updateBotMessage(data)).toEqual(expectedAction);
  });

  it('should create an action to update the conversation', () => {
    const data = {};
    const expectedAction = {
      type: SET_CONVERSATION_DATA,
      data,
    };
    expect(updateConversation(data)).toEqual(expectedAction);
  });

  it('should create an action to refresh the conversation', () => {
    const expectedAction = {
      type: REFRESH_CONVERSATION,
    };
    expect(refreshConversation()).toEqual(expectedAction);
  });

  it('should create an action to minimise the conversation', () => {
    const expectedAction = {
      type: SET_MINIMISE_STATE,
    };
    expect(setMinimiseState()).toEqual(expectedAction);
  });

  it('should create an action to minimise the conversation', () => {
    const lang = 'en';
    const expectedAction = {
      type: SET_LANGUAGE,
      lang,
    };
    expect(setLanguage(lang)).toEqual(expectedAction);
  });
});

describe('async actions', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const responseData = [{
    conversationId: '1234',
    storyblokId: '1234',
    speech: 'Blah blah',
    resources: [],
    checkBoxOptions: [],
    radioButtonOptions: [],
    previousMessageId: '1234',
    messageId: '1234',
  }];


  it('creates ADD_BOT_MESSAGE when fetching userMessage has been done and botMessage returned', () => {
    fetchMock.mock('/usermessage', responseData);

    const requestData = {
      speech: 'blah blah',
      conversationId: '1234',
      previousMessageStoryblokId: '1234',
    };

    const expectedActions = [
      { type: ADD_BOT_MESSAGE, data: responseData },
    ];

    const store = mockStore({});

    return store.dispatch(fetchBotResponse(requestData)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates ADD_BOT_MESSAGE and sets language when fetching userMessage and speech begins SETUP-language-', () => {
    fetchMock.mock('/usermessage', responseData);

    const requestData = {
      speech: 'SETUP-language-en',
      conversationId: '1234',
      previousMessageStoryblokId: '1234',
    };

    const expectedActions = [
      { type: SET_LANGUAGE, lang: 'en' },
      { type: ADD_BOT_MESSAGE, data: responseData },
    ];

    const store = mockStore({});

    return store.dispatch(fetchBotResponse(requestData)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates ADD_BOT_MESSAGE and sets conversationId when fetching userMessage and conversationId is missing', () => {
    fetchMock.mock('/usermessage', responseData);
    fetchMock.mock('/conversation/new', { conversationId: 1234 });

    const requestData = {
      speech: 'blah blah',
      previousMessageStoryblokId: '1234',
    };

    const expectedActions = [
      { type: SET_CONVERSATION_DATA, data: { conversationId: 1234 } },
      { type: ADD_BOT_MESSAGE, data: responseData },
    ];

    const store = mockStore({});

    return store.dispatch(fetchBotResponse(requestData)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates ADD_BOT_MESSAGE when fetching new conversation', () => {
    const store = mockStore({});

    const newConversationMessage = [{
      speech: "Hi there, I'm Little Window. I’m glad you’re here. It took real strength to reach out today.  I'm a confidential chatbot and I'm here to support you.",
    },
    {
      checkBoxOptions: [
        { text: 'English', postback: 'SETUP-language-en' },
        { text: 'Français', postback: 'SETUP-language-fr' },
        { text: 'A different language', postback: 'SETUP-language-None' },
      ],
      speech: 'What language would you like to talk to me in?',
    }];
    getNewConversationMessage.mockResolvedValue(newConversationMessage);

    const expectedActions = [
      { type: ADD_BOT_MESSAGE, data: newConversationMessage },
    ];

    return store.dispatch(startNewConversation()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
