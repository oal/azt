# Azt ECS
Azt is an ECS library written in Typescript.

### Example
```typescript
// Create a couple of components.
class PositionComponent extends Component {
    x: number = 0;
    y: number = 0;
}

class RotationComponent extends Component {
    angle: number = 0;
}

// Create a system to operate on components.
class MovementSystem extends System.requires(PositionComponent, RotationComponent) {
    update(dt, entity, [pos, rot]) {
        pos.x += 0.1;
        rot.angle += Math.PI/5;
    }
}

// Set up entity manager and systems.
let manager = new EntityManager();
let system = new MovementSystem(manager);

// Create a new entity.
let entity = manager.createEntity();

// Add components.
manager.setComponent(entity, new PositionComponent());
manager.setComponent(entity, new RotationComponent());

// Or remove.
manager.deleteComponent(entity, PositionComponent);
manager.setComponent(entity, new PositionComponent());

// Completely remove entity.
manager.deleteEntity(entity);

// Run systems. You should do this in a loop.
dt = 1000/60;
system.run(dt);
```