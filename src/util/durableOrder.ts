export interface Orderable { id: string }
export interface DurableOrderSnapshot { [id: string]: number; }
export type DurableOrderingMethod = (item: Orderable) => number;

export type DurableOrderResult = {
  sortedItems: Orderable[],
  orderingSnapshot: DurableOrderSnapshot
}

// Just sort a list just one time.  If other items are added later, then remember the original order
// of the first items, and just show the new items at the bottom of the list.
export const durableOrder = (items: Orderable[], 
                             orderingMethod: DurableOrderingMethod,
                             orderingSnapshot: DurableOrderSnapshot = {}): DurableOrderResult => {

  // If we don't have any memories yet, and we have some items, then make memories
  if ( items.length > 0 && orderingSnapshotSize(orderingSnapshot) === 0 ) {

    // Use our provided method to assign ordering, and pre-sort based on this
    const sortingMethod = (a: any, b: any): number => orderingMethod(a) - orderingMethod(b);
    const sortedItems: any[] = [...items].sort(sortingMethod);
    orderingSnapshot = sortedItems.reduce((map: any, item: any, index: number) => {
        map[item.id] = index;
        return map;
      }, {});
  }

  // The previously sorted items stay sorted.  The new items get added at the end.
  const orderedItemCount: number = orderingSnapshotSize(orderingSnapshot);
  const presortedItems: any[] = items.slice(0, orderedItemCount);
  const unsortedItems: any[] = items.slice(orderedItemCount);

  // Sort our entries using the map we've created
  const sortingMethod = (a: any, b: any): number => orderingSnapshot[a.id] - orderingSnapshot[b.id];
  const sortedItems = [...presortedItems].sort(sortingMethod).concat(unsortedItems);
  return { sortedItems, orderingSnapshot }
}

const orderingSnapshotSize = (map: DurableOrderSnapshot) => {
  return Object.keys(map).length;
}