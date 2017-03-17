import { Injectable } from '@angular/core';
import { ToDoItem } from './todo-item';
import { GuidGeneratorService } from './guid-generator.service';

/**
 * This repository uses Html5 local storage to store items.
 * Commonly, this is limited to 10 MB per domain in most browsers.
 */
@Injectable()
export class ToDoRepositoryService {

    /**
     * Localstorage works like a key-value store, so a 
     * known key is used to store an array of saved ids
     */
    private readonly localStorageIndexName = 'ToDoItems';

    constructor(private guidGeneratorService: GuidGeneratorService){
        if (this.getAllItems().length === 0){
            this.resetAllItems();
        }
    }

    public async saveItem(item: ToDoItem){
        if (!item.id) {
            var newGuid = await this.guidGeneratorService.createGuid();
            item.id = newGuid;
            this.addIdToStorageIndex(item.id);
        }
        localStorage.setItem(item.id, JSON.stringify(item));
    }

    private addIdToStorageIndex(id: string){
        var storedItemIds = this.getStoredItemsIndex();
        storedItemIds.push(id);
        localStorage.setItem(this.localStorageIndexName, JSON.stringify(storedItemIds));
    }

    private deleteIdFromStorageIndex(id: string){
        var storedItemIds = this.getStoredItemsIndex();
        storedItemIds.splice(storedItemIds.findIndex(i => i === id), 1);
        localStorage.setItem(this.localStorageIndexName, JSON.stringify(storedItemIds));
    }

    public deleteItem(item: ToDoItem){
        if (item.id){
            localStorage.removeItem(item.id);
            this.deleteIdFromStorageIndex(item.id);
        }
    }

    public getAllItems(): ToDoItem[] {
        var storedItemIds = this.getStoredItemsIndex();
        var result = new Array<ToDoItem>();
        storedItemIds.forEach(itemId => {
            var serializedItem = localStorage.getItem(itemId);
            var deserializedItem = JSON.parse(serializedItem);
            result.push(deserializedItem);
        })
        return result;
    }

    public async resetAllItems() {
        var allItems = this.getAllItems();
        allItems.forEach(item => this.deleteItem(item));
        var newItems = this.getInitialItems();
        var itemsSaveTasks = newItems.map(i => {
            return this.saveItem(i);
        });
        await Promise.all(itemsSaveTasks);
    }

    private getStoredItemsIndex(): string[]{
        var serializedLocalStorageIndex = localStorage.getItem(this.localStorageIndexName);
        var storedItemIds = serializedLocalStorageIndex && JSON.parse(serializedLocalStorageIndex) as string[] || [];
        return storedItemIds;
    }

    private getInitialItems(): ToDoItem[]{
        return [
            <ToDoItem>{
                isCompleted: false,
                title: 'Read the prequel to "Clean Code"'
            },
            <ToDoItem>{
                isCompleted: false,
                title: 'Buy flowers for Laura when driving home'
            },
            <ToDoItem>{
                isCompleted: false,
                title: 'Make an appointment with the barber'
            },
            <ToDoItem>{
                isCompleted: true,
                title: 'Wake up early to enjoy the sunrise'
            }
        ];
    }
}