import {Component, ComponentClass, ComponentStore, Entity} from "./typedefs";
import ArrayComponentStore from "./stores/ArrayComponentStore";

class AssertionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AssertionError';
    }
}

function assert(condition: boolean, message?: string) {
    if (!condition) {
        throw new AssertionError(message || 'Assertion failed');
    }
}

export default class EntityManager {
    private entities: Uint16Array = new Uint16Array(1024);
    private deletedEntities: Entity[] = [];
    private nextEntity: Entity = 0;
    private components: ComponentStore;

    constructor(store?: ComponentStore) {
        this.components = store || new ArrayComponentStore();
    }

    createEntity(): Entity {
        let entity = this.getNextEntity();
        this.entities[entity] = 1;
        return entity;
    }

    private getNextEntity() {
        if (this.deletedEntities.length > 0) {
            return this.deletedEntities.pop();
        }
        return this.nextEntity++;
    }

    deleteEntity(entity: Entity) {
        assert(this.hasEntity(entity), 'Tried to delete non-existing entity.');

        this.entities[entity]--;

        let componentTypes = this.components.getRegistered();
        for (let componentType of componentTypes) {
            // If no components left, we don't need to loop through the rest of the component types.
            let componentsLeft = this.entities[entity];
            if (componentsLeft === 0) break;

            this.deleteComponent(entity, componentType);
        }
        this.deletedEntities.push(entity);
    }

    getEntities(type: ComponentClass) {
        return this.components.getEntities(type);
    }

    hasEntity(entity: Entity) {
        return this.entities[entity] > 0;
    }

    hasComponent(entity: Entity, type: ComponentClass) {
        return this.components.has(entity, type);
    }

    getComponent(entity: Entity, type: ComponentClass) {
        return this.components.get(entity, type);
    }

    setComponent(entity: Entity, component: Component) {
        assert(this.hasEntity(entity), 'Tried to set component of non-existing entity.');

        let newComponentWasAdded = this.components.set(entity, component);
        if (newComponentWasAdded) {
            this.entities[entity]++;
        }
    }

    deleteComponent(entity: Entity, type: ComponentClass) {
        let componentWasDeleted = this.components.delete(entity, type);
        if (componentWasDeleted) {
            this.entities[entity]--;
        }
    }
}
