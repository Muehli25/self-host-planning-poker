import { decks, decksDict, displayCardValue, displayDeckValues } from './deck';

describe('Deck Model', () => {
  it('should contain default decks', () => {
    expect(decks.length).toBeGreaterThan(0);
    expect(decksDict['FIBONACCI']).toBeDefined();
    expect(decksDict['T_SHIRTS']).toBeDefined();
  });

  it('should format deck values string using displayDeckValues', () => {
    const fibDeck = decksDict['FIBONACCI'];
    const result = displayDeckValues(fibDeck);
    expect(result).toContain('?, 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89');
  });

  it('should display card value correctly with displayCardValue', () => {
    const fibDeck = decksDict['FIBONACCI'];
    expect(displayCardValue(fibDeck, -1)).toBe('?');
    expect(displayCardValue(fibDeck, 5)).toBe(5);
    expect(displayCardValue(fibDeck, 999)).toBeUndefined();

    const tShirtDeck = decksDict['T_SHIRTS'];
    expect(displayCardValue(tShirtDeck, 1)).toBe('XXS');
    expect(displayCardValue(tShirtDeck, 4)).toBe('M');
  });
});
