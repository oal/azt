export class Component {
}
export type ComponentClass = typeof Component;
export interface ComponentStore {
    has(entity: Entity, type: ComponentClass): boolean;
    get(entity: Entity, type: ComponentClass): Component | null;
    set(entity: Entity, component: Component): boolean;
    delete(entity: Entity, type: ComponentClass): boolean;
    getEntities(type: ComponentClass): IterableIterator<Entity>;
    getRegistered(): IterableIterator<ComponentClass>
}

export type Entity = number;
export type EntityTuple = [Entity, Component[]];