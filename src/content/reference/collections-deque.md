---
title: ArrayDeque as stack and queue
category: collections
order: 6
blurb: One class for both, and the two older ones to avoid.
---
```java
// Stack (LIFO)
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1); stack.push(2);
stack.peek();   // 2
stack.pop();    // 2

// Queue (FIFO)
Deque<Integer> queue = new ArrayDeque<>();
queue.addLast(1); queue.addLast(2);
queue.peekFirst();  // 1
queue.pollFirst();  // 1

// Both ends, for a sliding-window maximum and similar
queue.addFirst(x); queue.addLast(x);
queue.pollFirst(); queue.pollLast();
queue.peekFirst(); queue.peekLast();
```

Use `ArrayDeque` for both. `Stack` is a legacy synchronised class and its
iteration order is bottom-to-top, which is the opposite of what you expect;
`LinkedList` allocates a node per element and is measurably slower.

`ArrayDeque` will not hold `null`, so `poll` returning `null` unambiguously
means empty.
