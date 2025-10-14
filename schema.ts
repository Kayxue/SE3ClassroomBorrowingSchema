import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const role = pgEnum("role", ["admin", "user"]);

export const user = pgTable("user", {
	id: varchar("id", { length: 21 }).primaryKey(),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	phoneNumber: text("phone_number").notNull(),
	role: role("role").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const classroom = pgTable("classroom", {
	id: varchar("id", { length: 21 }).primaryKey(),
	name: text("name").notNull(),
	location: text("location").notNull(),
	capacity: integer("capacity").notNull(),
	status: text("status", {
		enum: ["available", "unavailable", "cannot use"],
	}).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
