import { normalizeUrl } from './url.utils';

describe('normalizeUrl', () => {
  it('should prepend https:// if the URL does not start with a protocol', () => {
    const url = 'example.com';
    const result = normalizeUrl(url);
    expect(result).toBe('https://example.com');
  });

  it('should not modify the URL if it already starts with http://', () => {
    const url = 'http://example.com';
    const result = normalizeUrl(url);
    expect(result).toBe(url);
  });

  it('should not modify the URL if it already starts with https://', () => {
    const url = 'https://example.com';
    const result = normalizeUrl(url);
    expect(result).toBe(url);
  });

  it('should prepend https:// if the URL starts with www.', () => {
    const url = 'www.example.com';
    const result = normalizeUrl(url);
    expect(result).toBe('https://www.example.com');
  });
});