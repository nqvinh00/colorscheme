export const codeSnippets = {
  javascript: `function fibonacci(n) {
  // Base cases
  if (n <= 1) return n;
  
  // Recursive calculation
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
const result = fibonacci(10);
console.log("Result:", result);`,

  python: `def quicksort(arr):
    """Quick sort implementation"""
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Example usage
numbers = [3, 6, 8, 10, 1, 2, 1]
sorted_numbers = quicksort(numbers)
print(sorted_numbers)`,

  java: `public class BinarySearch {
    /**
     * Binary search implementation
     */
    public static int search(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1; // Not found
    }
}`,

  rust: `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<String, usize> {
    let mut counts = HashMap::new();
    
    for word in text.split_whitespace() {
        let word = word.to_lowercase();
        *counts.entry(word).or_insert(0) += 1;
    }
    
    return counts;
}

fn main() {
    let text = "hello world hello rust";
    let counts = word_count(text);
    println!("{:?}", counts);
}`,

  typescript: `interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];

  // Add a new user
  addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...user
    };
    
    this.users.push(newUser);
    return newUser;
  }

  // Find user by email
  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }
}`,

  go: `package main

import (
    "fmt"
    "strings"
)

// WordCount counts occurrences of each word
func WordCount(text string) map[string]int {
    counts := make(map[string]int)
    
    words := strings.Fields(strings.ToLower(text))
    for _, word := range words {
        counts[word]++
    }
    
    return counts;
}

func main() {
    text := "hello world hello go";
    counts := WordCount(text);
    fmt.Printf("%+v\\n", counts);
}`,
};
