import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot'

import { journalTable } from '~/db/schema/journal'
import { userTable } from '~/db/schema/user'

export const noteTable = pgTable('notes', {
  id: serial('id').primaryKey(),
  wordsCount: integer('words_count'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),

  authorId: integer('author_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  journalId: text('journal_id').notNull().references(() => journalTable.id, {
    onDelete: 'cascade',
  }),
})

export const notesRelations = relations(noteTable, ({ one }) => ({
  author: one(userTable, {
    fields: [noteTable.authorId],
    references: [userTable.id],
  }),
  journal: one(journalTable, {
    fields: [noteTable.journalId],
    references: [journalTable.id],
  }),
}))

export const insertNoteSchema = createInsertSchema(noteTable)
export const selectNoteSchema = createSelectSchema(noteTable)
