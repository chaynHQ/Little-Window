const apiai = require('apiai');
const { DF_KEY } = require('../config');
const saveConversation = require('./database/queries/save_conversation');
const saveMessage = require('./database/queries/save_message');
const googleCall = require('./googleCall');

const app = apiai(DF_KEY);

// error messages in french or english

const errResources = (lang) => {
  let message;
  if (lang === 'en') {
    message = "Sorry, there's been a problem getting the information. Please check the Chayn website or try again later!";
  } if (lang === 'fr') {
    message = "Je rencontre un souci technique et j'ai du mal à trouver l'information que tu recherches. N'hésite pas à consulter le site de Chayn ou reviens me voir plus tard ! Merci";
  }
  return message;
};

const errTechnical = (lang) => {
  let message;
  if (lang === 'en') {
    message = "I'm really sorry but I can't chat right now due to technical problems, please check the Chayn website for any information you are looking for or try again later";
  } if (lang === 'fr') {
    message = "Je rencontre un souci technique et j'ai bien peur de ne pas pouvoir discuter dans l'immédiat. En attendant que je sois de retour sur pattes, n'hésite pas à consulter le site de Chayn, et reviens me voir plus tard ! Merci";
  }
  return message;
};

// the call to Dialog Flow
const dialogFlow = (req, res, speech) => {
  // TODO: remove the need for this to be labeled uniqueConversationId
  // should instead be conversationId or sessionId
  const requestdf = app.textRequest(speech, {
    sessionId: req.body.uniqueConversationId || req.body.conversationId || req.body.uniqueId,
  });

  const selectedLang = req.body.lang;
  requestdf.language = selectedLang;

  requestdf.on('response', (response) => {
    const { messages } = response.result.fulfillment;
    const data = {
      speech: messages[0].speech,
      options: [],
      resources: [],
      selectOptions: [],
      retrigger: '',
      timedelay: '',
      refresh: '',
      GDPROptOut: false,
    };
    // save message to database
    saveMessage(data.speech, response.sessionId);

    const payload = messages[1] ? messages[1].payload : {};
    // check if refresh exists in payload (it's only in one message)
    if (payload.refresh) {
      data.refresh = payload.refresh;
    }

    // check if timedelay exists (slow, very slow and fast)
    data.timedelay = payload.timedelay ? payload.timedelay : 'fast';

    // check if retrigger exists so next message gets sent without user input
    // (needed to display several messages in a row)
    if (payload.retrigger) {
      data.retrigger = payload.retrigger;
    }

    // check if GDPROptOut flag has been set (see A_OptOutConfirm in Dialog Flow)
    if (payload.GDPROptOut) {
      data.GDPROptOut = true;
    }

    // TodO: this is a horribly formated response,
    // selectedCountries is too specific, we need to make it general to radiobuttons
    // There is no standardised checking on what is being sent back and forth
    // The postback is attached to each option,
    // which doesn't make sense in the case of radio buttons
    // check if resources exist and if so do the call to Google Sheets
    if (payload.resources) {
      const { selectedCountries } = req.body;
      const lookupVal = speech || 'Global';
      const resourceLink = selectedCountries || [{ lookup: lookupVal }];
      const promiseArray = googleCall(resourceLink, selectedLang);

      Promise.all(promiseArray)
        .then((resources2dArray) => {
          data.resources = [].concat(...resources2dArray);
          res.send(data);
        })
        .catch(() => {
          data.resources = [
            { text: 'Chayn Website', href: 'https://chayn.co' },
          ];
          data.retrigger = '';
          data.speech = errResources(selectedLang);
          res.send(data);
        });
      // if no resources then set the right type of buttons
    } else {
      data.options = payload.options ? [...payload.options] : data.options;
      data.selectOptions = payload.selectOptions
        ? [...payload.selectOptions]
        : data.selectOptions;
      res.send(data);
    }
  });

  requestdf.on('error', () => {
    const data = {
      options: [],
      selectOptions: [],
      timedelay: '',
      resources: [{ text: 'Chayn Website', href: 'https://chayn.co' }],
      retrigger: '',
      speech: errTechnical(selectedLang),
    };
    res.send(data);
  });

  requestdf.end();
};

// if it is the first input from user, save the conversation id in database
const userMessage = (req, res) => {
  const { speech, uniqueConversationId } = req.body;
  if (
    speech === 'Little Window language selection'
  ) {
    saveConversation(uniqueConversationId);
  }
  saveMessage(speech, uniqueConversationId);
  dialogFlow(req, res, speech);
};

module.exports = userMessage;
