export class Menu {

	type;

	

	constructor() {
		
	}
	create() {
		console.log('Menu has been created.');
	}
	mouseOver(event) {
		let args = event.detail;
		if (args.ID) {
			console.log('Menu item id "' + args.ID + '" has been hovered-in.');
		} else {
			console.log('Menu item has been hovered-in.');
		}
	}
	mouseOut(event) {
		let args = event.detail;
		if (args.ID) {
			console.log('Menu item id "' + args.ID + '" has been hovered-out.');
		} else {
			console.log('Menu item has been hovered-out.');
		}
	}
	menuClick(event) {
		let args = event.detail;
		if (args.ID) {
			console.log('Menu item id "' + args.ID + '" is clicked.');
		} else {
			console.log('Menu item is clicked.');
		}
	}
	keyDown(event) {
		let args = event.detail;
		if (args.ID) {
			console.log('Menu item id "' + args.ID + '" has been changed by keys.');
		} else {
			console.log('Menu item has been changed by keys.');
		}
	}
}