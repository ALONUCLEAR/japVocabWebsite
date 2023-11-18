import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type FilterOutput = {
  [fieldName: string]: any;
};
export type InputType =
  | 'color'
  | 'date'
  | 'button'
  | 'email'
  | 'number'
  | 'text';

const typeMapper = (value: string, type?: InputType) => {
  switch (type) {
    case 'date':
      return new Date(value);
    case 'number':
      return Number(value);
    default:
      return value;
  }
};

export interface FilterInput {
  name: string;
  type?: InputType;
}

@Component({
  selector: 'filters',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
})
export class FilterComponent implements OnInit {
  @Input() fields: FilterInput[] = [];
  @Output() filtersChanged: EventEmitter<FilterOutput> = new EventEmitter();

  fieldFilterValues: FilterOutput = {};
  fieldFilters: FilterOutput = {};

  ngOnInit(): void {
    this.fields.forEach((field) => (this.fieldFilterValues[field.name] = ''));
  }

  onFiltersChanges(field: FilterInput, value: string) {
    if (value?.length) {
      this.fieldFilters[field.name] = typeMapper(value, field.type);
    } else {
      delete this.fieldFilters[field.name];
    }
    
    this.filtersChanged.emit(this.fieldFilters);
  }
}
