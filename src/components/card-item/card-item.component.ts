import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
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

  private openItem (uuidItem: string) {
    this.dataToEmmit.emit({ uuidItem: uuidItem });
  }
}
