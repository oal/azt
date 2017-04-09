let test = require("tape");
let {EntityManager, ArrayComponentStore, MapComponentStore} = require("../lib/index");


class PositionComponent {
	constructor() {
		this.x = 0;
		this.y = 0;
	}
}

class RotationComponent {
	constructor() {
		this.angle = 0;
	}
}

let componentStores = [ArrayComponentStore, MapComponentStore];

componentStores.forEach(ComponentStore => {
	test('hasComponent', (t) => {
		// Setup
		let manager = new EntityManager(new ComponentStore());

		// Assertions
		let nonExistingEntity = 123;
		t.false(manager.hasComponent(nonExistingEntity, PositionComponent));

		let entity = manager.createEntity();
		t.false(manager.hasComponent(entity, PositionComponent));

		manager.setComponent(entity, new PositionComponent());
		t.true(manager.hasComponent(entity, PositionComponent));

		manager.deleteComponent(entity, PositionComponent);
		t.false(manager.hasComponent(entity, PositionComponent));

		manager.setComponent(entity, new PositionComponent());
		manager.deleteEntity(entity);
		t.false(manager.hasComponent(entity, PositionComponent));

		t.end();
	});

	test('Entity reuse', (t) => {
		// Setup
		let manager = new EntityManager(new ComponentStore());

		// Assertions
		let entity = manager.createEntity();
		manager.deleteEntity(entity);
		t.equals(manager.createEntity(), 0);

		t.end();
	})
});

