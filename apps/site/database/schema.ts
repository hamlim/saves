import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

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

export let collections = pgTable("saves-collections", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
});

export type Collection = typeof collections.$inferSelect;

export let tags = pgTable("saves-tags", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
});

export type Tag = typeof tags.$inferSelect;

export let content = pgTable("saves-content", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  url: text("url"),
  title: text("title"),
  description: text("description"),
  notes: text("notes"),
  content: jsonb("content"),
});

export type Content = typeof content.$inferSelect;

// Junction table for many-to-many relationship between content and collections
export let contentCollections = pgTable("saves-content-collections", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  contentId: text("content_id")
    .references(() => content.id)
    .notNull(),
  collectionId: text("collection_id")
    .references(() => collections.id)
    .notNull(),
});

// Junction table for many-to-many relationship between content and tags
export let contentTags = pgTable("saves-content-tags", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  contentId: text("content_id")
    .references(() => content.id)
    .notNull(),
  tagId: text("tag_id")
    .references(() => tags.id)
    .notNull(),
});

export let apiKeys = pgTable("saves-api-keys", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  key: text("key").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }),
  lastUsedAt: timestamp("last_used_at", {
    withTimezone: true,
    mode: "date",
  }),
  isRevoked: boolean("is_revoked").default(false),
  scopes: jsonb("scopes").default(["*"]),
});

export type ApiKey = typeof apiKeys.$inferSelect;
