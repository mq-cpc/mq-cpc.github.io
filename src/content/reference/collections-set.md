---
title: HashSet
category: collections
order: 3
blurb: Membership tests, deduplication, and set operations.
---
```java
Set<Integer> seen = new HashSet<>();

// add returns false if it was already there — one call does both jobs
if (!seen.add(x)) {
    // duplicate
}

seen.contains(x);
seen.remove(x);

// Deduplicate a list, keeping no particular order
List<Integer> unique = new ArrayList<>(new HashSet<>(values));
```

Set operations mutate the receiver, so copy first unless you want that:

```java
Set<Integer> a = new HashSet<>(List.of(1, 2, 3));
Set<Integer> b = new HashSet<>(List.of(2, 3, 4));

Set<Integer> union = new HashSet<>(a);
union.addAll(b);                              // {1, 2, 3, 4}

Set<Integer> intersection = new HashSet<>(a);
intersection.retainAll(b);                    // {2, 3}

Set<Integer> difference = new HashSet<>(a);
difference.removeAll(b);                      // {1}
```
