"""
Seed script to populate the skill trees table with the previously hardcoded skill trees
"""

import json
import sys
import os
from datetime import datetime

# Add the parent directory to the path so we can import the app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import SessionLocal
from app.models.skill_tree import SkillTree

# Sample skill tree data
sample_skill_trees = [
    {
        "id": "ST1",
        "title": "OOPs Fundamentals",
        "description": "Learn the core concepts of object-oriented programming",
        "guide": "",
        "bg_color": "#e74c3c",
        "percentage_completed": 59,
        "nodes": [
            {
                "title": "Introduction to OOP",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/WqQsuIW2k0M",
                        "title": "What is Object-Oriented Programming?",
                    },
                    {
                        "type": "text",
                        "content": "OOP is a programming paradigm that organizes code using objects and classes...",
                    },
                    {
                        "type": "problem",
                        "id": "PP1",
                        "content": "Define a simple `Person` class in Java with attributes `name` and `age`.",
                    },
                ],
            },
            {
                "title": "Classes and Objects",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/kJEsTjH5mVg",
                        "title": "Understanding Classes and Objects",
                    },
                    {
                        "type": "text",
                        "content": "A class is a blueprint for creating objects. It defines properties and behaviors.",
                    },
                    {
                        "type": "problem",
                        "id": "PP2",
                        "content": "Create a `Car` class in Java with methods `accelerate()` and `brake()`.",
                    },
                ],
            },
            {
                "title": "Encapsulation and Abstraction",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/W7mR3M5mwdU",
                        "title": "Encapsulation Explained",
                    },
                    {
                        "type": "text",
                        "content": "Encapsulation is the bundling of data with methods that operate on the data...",
                    },
                    {
                        "type": "problem",
                        "id": "PP3",
                        "content": "Modify the `Car` class to make its attributes private and add getter methods.",
                    },
                ],
            },
        ],
    },
    {
        "id": "ST2",
        "title": "Design Patterns: 101",
        "description": "Learn essential software design patterns",
        "guide": "Dr. Noel Tiju",
        "bg_color": "#f39c12",
        "percentage_completed": 10,
        "nodes": [
            {
                "title": "Introduction to Design Patterns",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/NU_1StN5Tkk",
                        "title": "What are Design Patterns?",
                    },
                    {
                        "type": "text",
                        "content": "Design patterns provide reusable solutions to common software design problems...",
                    },
                    {
                        "type": "problem",
                        "id": "PP4",
                        "content": "List three commonly used design patterns and briefly describe their use cases.",
                    },
                ],
            },
            {
                "title": "Singleton Pattern",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/hUE_j6q0LTQ",
                        "title": "Understanding the Singleton Pattern",
                    },
                    {
                        "type": "text",
                        "content": "The Singleton Pattern ensures that a class has only one instance and provides a global point of access...",
                    },
                    {
                        "type": "problem",
                        "id": "PP5",
                        "content": "Implement the Singleton pattern in Python with a private constructor.",
                    },
                ],
            },
            {
                "title": "Factory Pattern",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/ExhgZZlzD6g",
                        "title": "Factory Pattern in Action",
                    },
                    {
                        "type": "text",
                        "content": "The Factory Pattern is used to create objects without specifying the exact class...",
                    },
                    {
                        "type": "problem",
                        "id": "PP6",
                        "content": "Implement a `ShapeFactory` in Java that creates objects of different shape types (Circle, Square).",
                    },
                ],
            },
        ],
    },
    {
        "id": "ST3",
        "title": "Data Structures Mastery",
        "description": "Master fundamental data structures",
        "guide": "",
        "bg_color": "#3498db",
        "percentage_completed": 35,
        "nodes": [
            {
                "title": "Arrays and Linked Lists",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/B31LgI4Y4DQ",
                        "title": "Understanding Data Structures",
                    },
                    {
                        "type": "text",
                        "content": "Arrays and linked lists are fundamental data structures that store collections of data...",
                    },
                    {
                        "type": "problem",
                        "id": "PP7",
                        "content": "Implement a linked list in C++ with `insert()` and `delete()` functions.",
                    },
                ],
            },
            {
                "title": "Stacks and Queues",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/0umWm9I2ZQ0",
                        "title": "Stacks and Queues Explained",
                    },
                    {
                        "type": "text",
                        "content": "Stacks follow LIFO (Last In First Out), whereas queues follow FIFO (First In First Out)...",
                    },
                    {
                        "type": "problem",
                        "id": "PP8",
                        "content": "Implement a stack using an array in Python.",
                    },
                ],
            },
            {
                "title": "Trees and Graphs",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/K7J3nCeRC80",
                        "title": "Introduction to Trees and Graphs",
                    },
                    {
                        "type": "text",
                        "content": "Trees and graphs are non-linear data structures used for hierarchical data representation...",
                    },
                    {
                        "type": "problem",
                        "id": "PP9",
                        "content": "Implement a binary search tree in Java.",
                    },
                ],
            },
        ],
    },
    {
        "id": "ST4",
        "title": "Competitive Programming Essentials",
        "description": "Learn techniques for competitive programming",
        "guide": "Prof. Daniel",
        "bg_color": "#2ecc71",
        "percentage_completed": 20,
        "nodes": [
            {
                "title": "Competitive Programming Basics",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/ekcwMsSIzVc",
                        "title": "How to Start Competitive Programming",
                    },
                    {
                        "type": "text",
                        "content": "Competitive programming involves solving algorithmic problems efficiently...",
                    },
                    {
                        "type": "problem",
                        "id": "PP10",
                        "content": "Solve the 'Two Sum' problem on LeetCode.",
                    },
                ],
            },
            {
                "title": "Time Complexity Analysis",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/FPu9Uld7W-E",
                        "title": "Understanding Big-O Notation",
                    },
                    {
                        "type": "text",
                        "content": "Time complexity helps us analyze how the execution time of an algorithm grows...",
                    },
                    {
                        "type": "problem",
                        "id": "PP11",
                        "content": "Analyze the time complexity of the Bubble Sort algorithm.",
                    },
                ],
            },
        ],
    },
    {
        "id": "ST5",
        "title": "SQL & Databases",
        "description": "Master SQL and relational database concepts",
        "guide": "",
        "bg_color": "#9b59b6",
        "percentage_completed": 75,
        "nodes": [
            {
                "title": "SQL Basics",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/HXV3zeQKqGY",
                        "title": "Introduction to SQL",
                    },
                    {
                        "type": "text",
                        "content": "SQL (Structured Query Language) is used to manage and query relational databases...",
                    },
                    {
                        "type": "problem",
                        "id": "PP12",
                        "content": "Write an SQL query to fetch all employees with a salary above $50,000.",
                    },
                ],
            },
            {
                "title": "Joins and Subqueries",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/2HVMiPPuPIM",
                        "title": "Understanding SQL Joins",
                    },
                    {
                        "type": "text",
                        "content": "Joins allow us to combine data from multiple tables...",
                    },
                    {
                        "type": "problem",
                        "id": "PP13",
                        "content": "Write an SQL query to get all orders with customer details using INNER JOIN.",
                    },
                ],
            },
        ],
    },
    {
        "id": "ST6",
        "title": "Algorithm Explorer",
        "description": "Explore various algorithms and their implementations",
        "guide": "Dr. Smith",
        "bg_color": "#f39c12",
        "percentage_completed": 50,
        "nodes": [
            {
                "title": "Sorting Algorithms",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/e0XskN3HTgU",
                        "title": "Sorting Algorithms Explained",
                    },
                    {
                        "type": "text",
                        "content": "Sorting algorithms are used to arrange data in a specific order...",
                    },
                    {
                        "type": "problem",
                        "id": "PP14",
                        "content": "Implement the Merge Sort algorithm in C++.",
                    },
                ],
            },
            {
                "title": "Graph Algorithms",
                "steps": [
                    {
                        "type": "video",
                        "content": "https://www.youtube.com/embed/09_LlHjoEiY",
                        "title": "Introduction to Graph Algorithms",
                    },
                    {
                        "type": "text",
                        "content": "Graph algorithms help solve problems involving networks, paths, and relationships...",
                    },
                    {
                        "type": "problem",
                        "id": "PP15",
                        "content": "Implement Dijkstra's algorithm in Python.",
                    },
                ],
            },
        ],
    },
]


def seed_skill_trees():
    """
    Seeds the database with sample skill trees
    """
    db = SessionLocal()
    try:
        print("Checking for existing skill trees...")
        # Check if skill trees already exist to avoid duplicates
        existing_ids = [tree.id for tree in db.query(SkillTree.id).all()]

        for tree_data in sample_skill_trees:
            # Skip if this skill tree ID already exists
            if tree_data["id"] in existing_ids:
                print(f"Skill tree {tree_data['id']} already exists, skipping.")
                continue

            print(f"Creating skill tree: {tree_data['title']} ({tree_data['id']})")

            # Create the skill tree object
            skill_tree = SkillTree(
                id=tree_data["id"],
                title=tree_data["title"],
                description=tree_data.get("description", ""),
                guide=tree_data.get("guide", ""),
                bg_color=tree_data.get("bg_color", "#3498db"),
                nodes=tree_data.get("nodes", []),
                percentage_completed=tree_data.get("percentage_completed", 0),
            )

            db.add(skill_tree)

        db.commit()
        print("Skill trees seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_skill_trees()
