import { convertToInternationalCurrencySystemToFixed } from '@/components/ui/charts/utils';

const company = { currency: 'USD' }
export const damageTypeFormatter = (text: string) => text.replace('bi ', 'BI ');
export const addCurrencySign = (
  num: number | undefined,
  currency?: string | undefined,
  maxFraction = 0,
) => {
  if (currency === undefined) {
    return num !== undefined
      ? `$${new Intl.NumberFormat().format(num)}`
      : 'N / A';
  } else {
    return num !== undefined
      ? `${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,

        // both of these options are needed to round to whole numbers. passing only one would lead to an error
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: maxFraction, // (causes 2500.99 to be printed as $2,501)
      }).format(num)}`
      : 'N / A';
  }
};

export const shortenNumber = (number: number) => {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};

export const useCurrencySignAdder = ({
  maxFraction = 0,
  shorten = false,
} = {}) => {

  return (num: number) => {
    const { value, suffix } = shorten
      ? convertToInternationalCurrencySystemToFixed(num)
      : { value: num, suffix: '' };
    return `${addCurrencySign(
      Number(value),
      company?.currency,
      maxFraction,
    )}${suffix}`;
  };
};

export const useCurrencySignAdderPredefinedCurrency = ({
  currency,
  maxFraction = 0,
  shorten = false,
}: {
  currency?: string;
  maxFraction?: number;
  shorten?: boolean;
}) => {
  return (num: number) => {
    const { value, suffix } = shorten
      ? convertToInternationalCurrencySystemToFixed(num)
      : { value: num, suffix: '' };
    if (!currency) {
      return `${num.toString()}${suffix}`;
    }
    return `${addCurrencySign(Number(value), currency, maxFraction)}${suffix}`;
  };
};
/* Returns the currency sign, Based on this https://stackoverflow.com/questions/50650503/get-the-currency-symbol-for-a-locale */
export const useCurrencySign = () => {

  const currency = company?.currency;

  const formattedString = addCurrencySign(0, currency, 0);
  return formattedString.replace(/\d/g, '').trim();
};

export const toChicagoTitleCase = (text: string) => {
  return toChicagoTitleCaseWithCustomSplit(text, ' ');
};

export const toChicagoTitleCaseWithCustomSplit = (
  text: string,
  splitCharacter: string,
) => {
  const splitted_text = text.split(splitCharacter);
  let titleString = '';
  const textLength = splitted_text.length;
  const lowerCases = new Set([
    'of',
    'the',
    'in',
    'a',
    'an',
    'to',
    'and',
    'at',
    'from',
    'by',
    'on',
    'or',
  ]); // list of lower case words that should only be capitalized at start and end of title
  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  let counter = 1;
  splitted_text.forEach((word) => {
    if (lowerCases.has(word) && titleString !== '' && counter !== textLength) {
      titleString = titleString + ' ' + word;
    } else {
      titleString = titleString + ' ' + capitalizeFirstLetter(word);
    }
    counter++;
  });
  return titleString.trim();
};

export const titleCase = (s: string) => {
  return s.replace(/^_*(.)|_+(.)/g, (s: any, c: string, d: string) =>
    c ? c.toUpperCase() : ' ' + d.toUpperCase(),
  );
};
