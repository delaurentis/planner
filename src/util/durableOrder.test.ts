import { durableOrder, 
         Orderable, 
         DurableOrderingMethod, 
         DurableOrderSnapshot } from './durableOrder';

// Extend the basic orderable to add more info
interface TestItem extends Orderable {
  id: string,
  priority: number
}

// Use priority to sort items
const orderingMethod: DurableOrderingMethod = (item: Orderable): number => { return (item as TestItem).priority; };

// Shortcut method.  Check to see if order matches 
const doesOrderMatch = (items: Orderable[], orderedIds: string[]): boolean => {

  // Size must match
  if ( items.length !== orderedIds.length ) return false;

  // All items must be in the order specified
  return !(items.some((item: Orderable, index: number) => orderedIds[index] !== item.id));
}

// Test the tester
test('test method catches incorrect orderings', () => {

  const items: Orderable[] = [
    { id: "a" },
    { id: "b" },
    { id: "c" },
    { id: "d" }
  ];

  expect(doesOrderMatch(items, ['a', 'b', 'c', 'd'])).toBe(true);
  expect(doesOrderMatch(items, ['a', 'b', 'd', 'c'])).toBe(false);
});


it('can sort all items when there is no prior memory', () => {

  const unsortedItems: TestItem[] = [
    { id: "c", priority: 3 },
    { id: "b", priority: 2 },
    { id: "d", priority: 4 },
    { id: "a", priority: 1 }
  ];

  const { sortedItems, orderingSnapshot } = durableOrder(unsortedItems, orderingMethod)
  
  // Validate there's a memory now with 4 key/value pairs
  expect(Object.keys(orderingSnapshot).length).toEqual(unsortedItems.length);

  // Validate the order is what's expected
  expect(doesOrderMatch(sortedItems, ['a', 'b', 'c', 'd'])).toBe(true);

});

it('it does not re-sort when earlier item ordering changes', () => {

  // In original ordering, A is first
  const existingSnapshot: DurableOrderSnapshot = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3
  }

  // Priority of A just changed to bottom, but it shouldn't matter
  const unsortedItems: TestItem[] = [
    { id: "a", priority: 10 },
    { id: "b", priority: 2 },
    { id: "c", priority: 3 },
    { id: "d", priority: 4 },
  ];

  // Sort, but use prior memory of the order
  const { sortedItems, orderingSnapshot } = durableOrder(unsortedItems, orderingMethod, existingSnapshot)
  
  // The memory shouldn't change
  expect(Object.is(orderingSnapshot, existingSnapshot));

  // Ordering should be identical
  expect(doesOrderMatch(sortedItems, ['a', 'b', 'c', 'd'])).toBe(true);
});

it('it does not re-sort when new items are added', () => {

  const unsortedItems: TestItem[] = [
    { id: "d", priority: 4 },
    { id: "b", priority: 2 },
    { id: "e", priority: 5 },
    { id: "a", priority: 1 },
    { id: "c", priority: 3 }
  ];

  // We have no prior memory of C
  const existingSnapshot: DurableOrderSnapshot = {
    "a": 0,
    "b": 1,
    "d": 2,
    "e": 3
  }

  // Sort, but use prior memory of the order
  const { sortedItems, orderingSnapshot } = durableOrder(unsortedItems, orderingMethod, existingSnapshot)
  
  // The memory shouldn't change
  expect(Object.is(orderingSnapshot, existingSnapshot));

  // C should appear at the end
  expect(doesOrderMatch(sortedItems, ['a', 'b', 'd', 'e', 'c'])).toBe(true);
});

it('ignores cases where there are zero items', () => {
  const { sortedItems, orderingSnapshot }  = durableOrder([], orderingMethod);
  expect(sortedItems.length).toEqual(0);
  expect(Object.keys(orderingSnapshot).length).toEqual(0);
})