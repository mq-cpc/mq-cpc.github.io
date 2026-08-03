---
title: Lists and sorting
category: collections
order: 1
blurb: ArrayList, sorting by a key, and the primitive-array trap.
---
```java
List<Integer> a = new ArrayList<>();
a.add(5); a.add(2); a.add(9);
a.get(0); a.set(0, 7); a.size();

Collections.sort(a);                          // natural order
a.sort(Comparator.reverseOrder());            // descending
a.sort(Comparator.comparingInt(x -> Math.abs(x)));   // by a key

// Sorting objects by one field, then another
people.sort(Comparator.comparingInt((int[] p) -> p[0])
                      .thenComparing(p -> p[1], Comparator.reverseOrder()));

int idx = Collections.binarySearch(a, 5);     // list must already be sorted

List<Integer> copy = new ArrayList<>(a);
Collections.reverse(copy);
```

`Arrays.sort` on a primitive array takes **no comparator** — it is a dual-pivot
quicksort with a worst case an adversarial test can hit. If you need a custom
order, or you are sorting values an opponent chose, box first:

```java
int[] raw = {5, 2, 9};
Arrays.sort(raw);                             // fine for random data

Integer[] boxed = {5, 2, 9};
Arrays.sort(boxed, Comparator.reverseOrder());  // merge sort, O(n log n) always
```
