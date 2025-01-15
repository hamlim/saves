import {
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export let users = pgTable("saves-users", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  username: text("username"),
  githubId: text("github_id"),
  avatarURL: text("avatar_url"),
  name: text("name"),
  email: text("email"),
});

export type User = typeof users.$inferSelect;

export let sessions = pgTable("saves-sessions", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
});

export let content = pgTable("saves-content", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  content: jsonb("content"),
});

export type Content = typeof content.$inferSelect;
