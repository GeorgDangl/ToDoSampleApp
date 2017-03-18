import { Component, OnInit } from '@angular/core';
import { ToDoRepositoryService } from './todo-repository.service';
import { ToDoItem } from './todo-item';

@Component({
    selector: 'todo-list',
    templateUrl: 'app/todo-list.component.html',
    styles: [
            '.finishedItem { text-decoration: line-through; }',
            '.finishedGroup input { background-color: #dff0d8; }',
            '.finishedGroup .input-group-addon { background-color: #dff0d8; }',
            '.input-group { padding: 3px; }',
            '.panel, panel-primary { margin-top: 30px; }'
        ]
})
export class ToDoListComponent implements OnInit {

    toDoItems: ToDoItem[];

    itemToEditId: string;
    editedTitle: string;
    newItemTitle: string;
    newItemSaveInProgress: boolean;
    finishedItems: number;

    constructor(private toDoRepositoryService:ToDoRepositoryService) { }

    ngOnInit(){
        this.refreshItems();
    }

    private refreshItems(){
        this.toDoItems = this.toDoRepositoryService.getAllItems();
        this.recalculateFinishedStatus();
    }

    recalculateFinishedStatus(){
        this.finishedItems = this.toDoItems.filter(i => i.isCompleted).length;
    }

    addNewItem(){
        this.newItemSaveInProgress = true;
        var newItem = new ToDoItem();
        newItem.title = this.newItemTitle;
        this.toDoRepositoryService.saveItem(newItem);
        this.newItemSaveInProgress = false;
        this.newItemTitle = null;
        this.refreshItems();
    }

    switchItemStatus(item: ToDoItem) {
        item.isCompleted = !item.isCompleted;
        this.toDoRepositoryService.saveItem(item);
        this.recalculateFinishedStatus();
    }

    prepareItemForEditing(item: ToDoItem){
        this.itemToEditId = item.id;
        this.editedTitle = item.title;
    }

    saveEditedItem(){
        var selectedItem = this.toDoItems.find(i => i.id === this.itemToEditId);
        selectedItem.title = this.editedTitle;
        this.toDoRepositoryService.saveItem(selectedItem);
        this.refreshItems();
        this.itemToEditId = null;
    }

    deleteItem(item: ToDoItem){
        this.toDoRepositoryService.deleteItem(item);
        this.refreshItems();
    }

    resetItems(){
        this.toDoRepositoryService.resetAllItems();
        this.itemToEditId = null;
        this.refreshItems();
    }
}