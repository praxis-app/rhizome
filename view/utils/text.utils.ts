import { marked } from 'marked';
import { URL_REGEX } from '../constants/shared.constants';

const truncate = (text: string, length = 30) => {
  const omission = '...';
  if (text.length <= length) {
    return text;
  }
  if (length <= omission.length) {
    return omission;
  }
  return text.slice(0, length - omission.length) + omission;
};

export const urlifyText = (text: string, urlTrimSize?: number) =>
  text.replace(URL_REGEX, (url) => {
    const truncatedURL = truncate(url, urlTrimSize);

    return (
      '<a href="' +
      url +
      '" rel="noopener noreferrer" target="_blank" style="color:#e4e6ea;">' +
      (urlTrimSize ? truncatedURL : url) +
      '</a>'
    );
  });

export const parseMarkdownText = async (text: string) => {
  const newLine = '<div style="margin-bottom: -6px;"></div>';
  const withNewLines = text.replace(/\n(?=\n)/g, newLine);
  const parsedText = await marked.parse(withNewLines);
  return parsedText.replace(/<\/?p>/g, '');
};

export const convertBoldToSpan = (text: string) =>
  text
    .replace(/<(b|strong)>/g, '<span style="font-family: Inter Bold;">')
    .replace(/<\/(b|strong)>/g, '</span>');
