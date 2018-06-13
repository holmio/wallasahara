import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ItemList } from '../../models/item.entities';
import { Observable } from 'rxjs';

/**
 * Generated class for the CardItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'card-item',
  templateUrl: 'card-item.component.html'
})
export class CardItemComponent {

  @Input() dataItems: Observable<any>;
  @Output() dataToEmmit: EventEmitter<any> = new EventEmitter<any>();

  // constructor() {}

  private openItem (uuidItem: string) {
    this.dataToEmmit.emit({ uuidItem: uuidItem });
  }
}
