// when more languages are added these should be changed to objects
// with key value pairs.

export function typingMessageLang(lang) {
  if (lang === 'en') return 'typing...';
  else if (lang === 'fr') return 'en train de taper...';
}

export function buttonMessageLang(lang) {
  if (lang === 'en') return 'Choose a button';
  else if (lang === 'fr') return 'Choisissez un bouton';
}

export function optionsLang(lang) {
  if (lang === 'en') return 'Pick one or more options';
  else if (lang === 'fr') return 'Choisissez une ou plusieurs options';
}

export function inputPlaceholderLang(lang) {
  if (lang === 'en') return 'Type here...';
  else if (lang === 'fr') return 'Tapez ici...';
}

export function submitTextLang(lang) {
  if (lang === 'en') return 'Submit';
  else if (lang === 'fr') return 'Soumettre';
}

const errResources = lang => {
  if (lang === 'en') {
    return "Sorry there's a problem getting the information, please check the Chayn website or try again later";
  } else if (lang === 'fr') {
    return "Désolé, il y a un problème pour obtenir l'information, s'il vous plaît consulter le site Web de Chayn ou réessayer plus tard";
  }
};

const errTechnical = lang => {
  if (lang === 'en') {
    return "I'm really sorry but I can't chat right now due to technical problems, please check the Chayn website for any information you are looking for or try again later";
  } else if (lang === 'fr') {
    return "Je suis vraiment désolé, mais je ne peux pas discuter maintenant en raison de problèmes techniques, s'il vous plaît consulter le site Web Chayn pour toute information que vous cherchez ou réessayez plus tard";
  }
};