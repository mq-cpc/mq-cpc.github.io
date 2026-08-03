---
title: TreeMap and TreeSet
category: collections
order: 4
blurb: Sorted keys, and the floor/ceiling lookups that replace a binary search.
---
```java
TreeMap<Integer, String> m = new TreeMap<>();
m.put(10, "a"); m.put(20, "b"); m.put(30, "c");

m.firstKey();        // 10
m.lastKey();         // 30
m.floorKey(15);      // 10  — greatest key <= 15
m.ceilingKey(15);    // 20  — least key >= 15
m.lowerKey(20);      // 10  — strictly less
m.higherKey(20);     // 30  — strictly greater

m.headMap(20);       // keys < 20
m.tailMap(20);       // keys >= 20
m.subMap(10, 30);    // [10, 30)

m.pollFirstEntry();  // remove and return the smallest
```

`TreeSet` has the same navigation without the values:

```java
TreeSet<Integer> s = new TreeSet<>();
s.add(5); s.add(1); s.add(9);

s.first(); s.last();
s.floor(7);    // 5
s.ceiling(7);  // 9
s.pollFirst(); s.pollLast();
s.descendingSet();
```

All operations are `O(log n)` rather than `O(1)` — use `HashMap`/`HashSet`
unless you actually need the ordering.

**The classic use:** "find the nearest value already inserted" becomes
`floor` plus `ceiling` and comparing the two, with no binary search to get
wrong under pressure.
