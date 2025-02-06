import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface Todo {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  startDate: string;
  endDate: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  todoForm: FormGroup;
  todos: Todo[] = [];

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group(
      {
        title: ['', Validators.required],
        description: ['', Validators.required],
        priority: ['Medium', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      },
      { validators: this.dateValidator }
    );
  }

  // Load tasks only in the client-side (browser)
  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.loadTodos();
    }
  }

  addTodo() {
    if (this.todoForm.valid) {
      const newTodo: Todo = {
        ...this.todoForm.value,
        completed: false
      };
      this.todos.push(newTodo);

      // Save updated task list to localStorage
      if (typeof window !== 'undefined') {
        this.saveTodos();
      }

      // Reset form with default values
      this.todoForm.reset({
        priority: 'Medium'
      });
    }
  }

  toggleCompletion(index: number) {
    this.todos[index].completed = !this.todos[index].completed;

    // Save updated task list to localStorage
    if (typeof window !== 'undefined') {
      this.saveTodos();
    }
  }

  deleteTodo(index: number) {
    this.todos.splice(index, 1);

    // Save updated task list to localStorage
    if (typeof window !== 'undefined') {
      this.saveTodos();
    }
  }

  dateValidator(formGroup: FormGroup) {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;

    return startDate && endDate && new Date(startDate) > new Date(endDate)
      ? { dateInvalid: true }
      : null;
  }

  private saveTodos() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  }

  private loadTodos() {
    if (typeof window !== 'undefined') {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        this.todos = JSON.parse(storedTodos);
      }
    }
  }
}
