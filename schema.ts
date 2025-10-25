import { desc } from "drizzle-orm";
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const role = pgEnum("Role", ["admin", "user"]);

export const reservationStatus = pgEnum("ReservationStatus", ["pending", "approved", "rejected"]);

export const bookingChangeAction = pgEnum("BookingChangeAction", ["approve", "reject"]);

export const classroomStatus = pgEnum("ClassroomStatus", [
	"available",
	"occupied",
	"maintenance",
]);

export const user = pgTable("user", {
	id: varchar("id", { length: 21 }).primaryKey(),
	username: text("username").notNull().unique(),
	name: text("name").notNull(),
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
	roomCode: text("room_code").notNull().unique(),
	name: text("name").notNull(),
	location: text("location").notNull(),
	capacity: integer("capacity").notNull(),
	description: text("description").notNull(),
	status: classroomStatus("status").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	photoUrl: text("photo_url").notNull(),
});


export const announcement = pgTable("announcement", {
	id: varchar("id", { length: 21 }).primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	publishedAt: timestamp("published_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	createdBy: varchar("created_by", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
})

export const key = pgTable("key", {
	id: varchar("id", { length: 21 }).primaryKey(),
	classroomId: varchar("classroom_id", { length: 21 }).references(() => classroom.id, { onDelete: "cascade" }),
	keyNumber: text("key_number").notNull().unique(),
	isActive: boolean("is_active").default(true).notNull(),
})

export const reservation = pgTable("reservation", {
	id: varchar("id", { length: 21 }).primaryKey(),
	userId: varchar("user_id", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
	classroomId: varchar("classroom_id", { length: 21 }).references(() => classroom.id, { onDelete: "set null" }),
	purpose: text("purpose").notNull(),
	startTime: timestamp("start_time", { withTimezone: true }).notNull(),
	approvedBy: varchar("approved_by", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
	rejectReason: text("reject_reason"),
	cancelReason: text("cancel_reason"),
	status: reservationStatus("status").default("pending").notNull(),
	endTime: timestamp("end_time", { withTimezone: true }).notNull(),
});

export const bookingChangeLog = pgTable("booking_change_log", {
	id: varchar("id", { length: 21 }).primaryKey(),
	actionTime: timestamp("action_time", { withTimezone: true }).notNull().defaultNow(),
	actorUserId: varchar("actor_user_id", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
	action: bookingChangeAction("action").notNull(),
	reservationId: varchar("reservation_id", { length: 21 }).references(() => reservation.id, { onDelete: "set null" }),
})

export const infraction = pgTable("infraction", {
	id: varchar("id", { length: 21 }).primaryKey(),
	userId: varchar("user_id", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
	reservationId: varchar("reservation_id", { length: 21 }).references(() => reservation.id, { onDelete: "set null" }),
	description: text("description").notNull(),
	createdBy: varchar("created_by", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
})

export const blacklist = pgTable("black_list", {
	id: varchar("id", { length: 21 }).primaryKey(),
	userId: varchar("user_id", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
	infractionId: varchar("infraction_id", { length: 21 }).references(() => infraction.id, { onDelete: "set null" }),
	createdBy: varchar("created_by", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	endAt: timestamp("end_at", { withTimezone: true }),

})

export const notificationLog = pgTable("notification_log", {
	id: varchar("id", { length: 21 }).primaryKey(),
	userId: varchar("user_id", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
	bookingChangeLogId: varchar("booking_change_log_id", { length: 21 }).references(() => bookingChangeLog.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
})

export const keyTransactionLog = pgTable("key_transaction_log", {
	id: varchar("id", { length: 21 }).primaryKey(),
	reservationId: varchar("reservation_id", { length: 21 }).references(() => reservation.id, { onDelete: "set null" }),
	keyId: varchar("key_id", { length: 21 }).references(() => key.id, { onDelete: "set null" }),
	borrowedTo: varchar("borrowed_to", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
	handledBy: varchar("handled_by", { length: 21 }).references(() => user.id, { onDelete: "set null" }),
	borrowedAt: timestamp("borrowed_at", { withTimezone: true }).notNull(),
	returnedAt: timestamp("returned_at", { withTimezone: true }),
	onTime: boolean("on_time").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
})