import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const userPreferences = pgTable('user_preferences', {
  userId: text('user_id').primaryKey(),
  tableCorners: text('table_corners').notNull().default('rounded'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
