import {
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  findRenderedDOMComponentWithClass,
  findRenderedDOMComponentWithTag,
  Simulate,
} from 'react-addons-test-utils';

/**
* A test wrapper for components that performs DOM interaction.
*/
export default class ComponentRender {
  constructor(jsx) {
    this._component = renderIntoDocument(jsx);
  };

  show() {
    this._component.show();
  }

  hide() {
    this._component.hide();
  }

  isOverlayVisible() {
    const found = scryRenderedDOMComponentsWithClass(this._component, 'popup-overlay');
    return found.length === 1;
  }

  clickOnOverlay() {
    const overlay = findRenderedDOMComponentWithClass(this._component, 'popup-overlay');
    Simulate.click(overlay);
  }

  clickOnClose() {
    const closeButton = findRenderedDOMComponentWithClass(this._component, 'popup-close-button');
    Simulate.click(closeButton);
  }

  isOpen() {
    const found = scryRenderedDOMComponentsWithClass(this._component, 'popup-overlay');
    return found.length === 1;
  }

}