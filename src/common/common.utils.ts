// TODO: Ensure all utils below are actually used in the code

// TODO: Verify that sanitizeHtml is correct version
import sanitizeHtml from 'sanitize-html';

import { PageSize } from './common.constants';

/**
 * Strip all HTML tags from a string and trim any whitespace
 */
export const sanitizeText = (dirty?: string) =>
  sanitizeHtml(dirty?.trim() || '', { allowedTags: [] });

/**
 * Normalize text by trimming whitespace and converting to lowercase
 */
export const normalizeText = (text?: string) => text?.trim().toLowerCase() || '';

export const paginate = <T extends { createdAt: Date }>(
  array: T[],
  offset: number,
  limit = PageSize.Default,
) => array.slice(offset, offset + limit);
