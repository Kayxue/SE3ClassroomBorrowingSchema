import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const role = pgEnum("role", ["admin", "user"]);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
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
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	location: text("location").notNull(),
	capacity: text("capacity").notNull(),
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
