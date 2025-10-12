import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	phoneNumber: text("phone_number").notNull(),
	role: text("role", { enum: ["admin", "user"] }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const classroom = pgTable("classroom", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	location: text("location").notNull(),
	capacity: text("capacity").notNull(),
	status: text("status", {
		enum: ["available", "unavailable", "cannot use"],
	}).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
