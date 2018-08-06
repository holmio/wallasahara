import { Component, Input, Output, EventEmitter } from '@angular/core';

// Rxjs
import { Observable } from 'rxjs';

/**
 * Component to show a gallery of items
 *
 */
@Component({
  selector: 'card-item',
  templateUrl: 'card-item.component.html'
})
export class CardItemComponent {

  @Input() dataItems: Observable<any>;
  @Output() dataToEmmit: EventEmitter<any> = new EventEmitter<any>();

  protected openItem (uuidItem: string) {
    this.dataToEmmit.emit({ uuidItem: uuidItem });
  }
}
