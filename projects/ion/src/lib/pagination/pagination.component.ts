import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DropdownItem } from '../core/types/dropdown';
import { IonPaginationProps, Page, PageEvent } from '../core/types/pagination';

export const ITEMS_PER_PAGE_DEFAULT = 10;
export const LIST_OF_PAGE_OPTIONS = [10, 20, 30, 40, 46];

@Component({
  selector: 'ion-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class IonPaginationComponent implements OnChanges, OnInit {
  @Input() total: IonPaginationProps['total'];
  @Input() itemsPerPage: IonPaginationProps['itemsPerPage'] =
    ITEMS_PER_PAGE_DEFAULT;
  @Input() pageSizeOptions: IonPaginationProps['pageSizeOptions'] =
    LIST_OF_PAGE_OPTIONS;
  @Input() size: IonPaginationProps['size'] = 'md';
  @Input() allowChangeQtdItems: IonPaginationProps['allowChangeQtdItems'];
  @Input() loading = false;
  @Input() page = 0;
  @Output() events = new EventEmitter<PageEvent>();

  public optionsPage?: DropdownItem[] = [];
  public labelPerPage = '';

  pages: Page[] = [];

  changeItemsPerPage(itemsSelected: DropdownItem[]): void {
    this.itemsPerPage = Number(itemsSelected[0].label.split(' / página')[0]);
    this.remountPages();
    this.labelPerPage = this.getSelectedItemsPerPageLabel(this.optionsPage);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.total && changes.total.firstChange) {
      this.remountPages();
    }

    if (changes.total && changes.total) {
      this.remountPages(false);
    }

    if (changes.page && changes.page.currentValue) {
      this.setPage(changes.page.currentValue);
    }
  }

  ngOnInit(): void {
    this.optionsPage = this.getOptionsPage();
    this.labelPerPage = this.getSelectedItemsPerPageLabel(this.optionsPage);
  }

  setPage(page = 1): void {
    if (page === 1) {
      this.remountPages();
    } else {
      this.selectPage(page);
    }
  }

  selectPage(pageNumber = 1, emitEvent = true): void {
    if (this.pages && !this.loading) {
      this.pages.forEach((pageEach) => {
        pageEach.selected = false;
      });
    }

    const page = this.pages[pageNumber - 1];
    page.selected = true;

    if (emitEvent) {
      this.events.emit({
        actual: page.page_number,
        itemsPerPage: this.itemsPerPage,
        offset: (page.page_number - 1) * this.itemsPerPage,
      });
    }
    this.page = page.page_number;
  }

  hasPrevious(): boolean {
    const firstPage = this.inFirstPage();
    return firstPage !== undefined && firstPage !== null && !firstPage;
  }

  hasNext(): boolean {
    const selecteds = this.pages.filter((page) => page.selected);
    return selecteds.length > 0 && !this.inLastPage();
  }

  previous(): void {
    if (!this.inFirstPage() && !this.loading) {
      this.selectPage(this.currentPage().page_number - 1);
    }
  }

  next(): void {
    if (!this.inLastPage() && !this.loading) {
      this.selectPage(this.currentPage().page_number + 1);
    }
  }

  remountPages(emitEvent = true): void {
    this.createPages(this.totalPages());
    if (this.pages.length) {
      this.selectPage(1, emitEvent);
    }
  }

  totalPages(): number {
    const numberOfPages = Math.ceil(this.total / this.itemsPerPage);
    return numberOfPages;
  }

  getSelectedItemsPerPageLabel(options: DropdownItem[]): string {
    const option = options.find((pageOption) => pageOption.selected);
    return (option && option.label) || this.generateLabel(this.itemsPerPage);
  }

  private createPages(qtdOfPages: number): void {
    this.pages = [];
    for (let index = 0; index < qtdOfPages; index++) {
      this.pages.push({
        selected: false,
        page_number: index + 1,
      });
    }
  }

  private currentPage(): Page {
    return this.pages.filter((page) => page.selected)[0];
  }

  private inLastPage(): boolean {
    const currentPageCopy = this.currentPage();
    return currentPageCopy && currentPageCopy.page_number === this.totalPages();
  }

  private inFirstPage(): boolean {
    const currentPageCopy = this.currentPage();
    return currentPageCopy && currentPageCopy.page_number === 1;
  }

  private generateLabel(page: number): string {
    return `${page} / página`;
  }

  private getOptionsPage(): DropdownItem[] {
    return this.pageSizeOptions.map((quantityOfPages) => {
      return {
        label: this.generateLabel(quantityOfPages),
        selected: this.isASelectedOption(quantityOfPages),
      };
    });
  }

  private isASelectedOption(quantityOfPages: number): boolean {
    return (
      this.pageSizeOptions.includes(this.itemsPerPage) &&
      this.itemsPerPage === quantityOfPages
    );
  }
}
