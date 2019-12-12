import { v4 } from 'uuid';
import {
  Cascade,
  Collection,
  Entity,
  IdentifiedReference,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  QueryOrder,
  UuidEntity,
} from '../../lib';
import { Publisher2 } from './Publisher2';
import { Author2 } from './Author2';
import { BookTag2 } from './BookTag2';
import { Test2 } from './Test2';

@Entity()
export class Book2 implements UuidEntity<Book2> {

  @PrimaryKey({ fieldName: 'uuid_pk', length: 36 })
  uuid: string = v4();

  @Property({ default: 'current_timestamp(3)', length: 3 })
  createdAt: Date = new Date();

  @Property({ nullable: true })
  title?: string;

  @Property({ type: 'text', nullable: true })
  perex?: string;

  @Property({ type: 'float', nullable: true })
  price?: number;

  @Property({ type: 'double', nullable: true })
  double?: number;

  @Property({ nullable: true })
  meta?: Book2Meta;

  @ManyToOne({ entity: 'Author2', cascade: [] })
  author: Author2;

  @ManyToOne({ entity: 'Publisher2', cascade: [Cascade.PERSIST, Cascade.REMOVE], nullable: true, wrappedReference: true })
  publisher?: IdentifiedReference<Publisher2>;

  @OneToOne({ cascade: [], mappedBy: 'book', nullable: true })
  test?: Test2;

  @ManyToMany({ entity: () => BookTag2, cascade: [], fixedOrderColumn: 'order' })
  tags = new Collection<BookTag2>(this);

  @ManyToMany(() => BookTag2, undefined, { pivotTable: 'book_to_tag_unordered', orderBy: { name: QueryOrder.ASC } })
  tagsUnordered = new Collection<BookTag2>(this);

  constructor(title: string, author: Author2) {
    this.title = title;
    this.author = author;
  }

}

export interface Book2Meta {
  category: string;
  items: number;
}
