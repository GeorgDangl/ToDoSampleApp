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

    async addNewItem(){
        this.newItemSaveInProgress = true;
        var newItem = new ToDoItem();
        newItem.title = this.newItemTitle;
        await this.toDoRepositoryService.saveItem(newItem);
        this.newItemSaveInProgress = false;
        this.newItemTitle = null;
        this.refreshItems();
    }

    async switchItemStatus(item: ToDoItem) {
        item.isCompleted = !item.isCompleted;
        await this.toDoRepositoryService.saveItem(item);
        this.recalculateFinishedStatus();
    }

    prepareItemForEditing(item: ToDoItem){
        this.itemToEditId = item.id;
        this.editedTitle = item.title;
    }

    async saveEditedItem(){
        var selectedItem = this.toDoItems.find(i => i.id === this.itemToEditId);
        selectedItem.title = this.editedTitle;
        await this.toDoRepositoryService.saveItem(selectedItem);
        this.refreshItems();
        this.itemToEditId = null;
    }

    deleteItem(item: ToDoItem){
        this.toDoRepositoryService.deleteItem(item);
        this.refreshItems();
    }

    async resetItems(){
        await this.toDoRepositoryService.resetAllItems();
        this.itemToEditId = null;
        this.refreshItems();
    }
}