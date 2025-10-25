CREATE TYPE "public"."BookingChangeAction" AS ENUM('approve', 'reject');--> statement-breakpoint
CREATE TYPE "public"."ReservationStatus" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TYPE "public"."status" RENAME TO "ClassroomStatus";--> statement-breakpoint
ALTER TYPE "public"."role" RENAME TO "Role";--> statement-breakpoint
CREATE TABLE "announcement" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(21)
);
--> statement-breakpoint
CREATE TABLE "black_list" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21),
	"infraction_id" varchar(21),
	"created_by" varchar(21),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"end_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "booking_change_log" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"action_time" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_user_id" varchar(21),
	"action" "BookingChangeAction" NOT NULL,
	"reservation_id" varchar(21)
);
--> statement-breakpoint
CREATE TABLE "infraction" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21),
	"reservation_id" varchar(21),
	"description" text NOT NULL,
	"created_by" varchar(21),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "key" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"classroom_id" varchar(21),
	"key_number" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "key_key_number_unique" UNIQUE("key_number")
);
--> statement-breakpoint
CREATE TABLE "key_transaction_log" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"reservation_id" varchar(21),
	"key_id" varchar(21),
	"borrowed_to" varchar(21),
	"handled_by" varchar(21),
	"borrowed_at" timestamp with time zone NOT NULL,
	"returned_at" timestamp with time zone,
	"on_time" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_log" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21),
	"booking_change_log_id" varchar(21),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservation" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21),
	"classroom_id" varchar(21),
	"purpose" text NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"approved_by" varchar(21),
	"reject_reason" text,
	"cancel_reason" text,
	"status" "ReservationStatus" DEFAULT 'pending' NOT NULL,
	"end_time" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "classroom" ADD COLUMN "room_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "classroom" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "classroom" ADD COLUMN "photo_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "black_list" ADD CONSTRAINT "black_list_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "black_list" ADD CONSTRAINT "black_list_infraction_id_infraction_id_fk" FOREIGN KEY ("infraction_id") REFERENCES "public"."infraction"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "black_list" ADD CONSTRAINT "black_list_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_change_log" ADD CONSTRAINT "booking_change_log_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_change_log" ADD CONSTRAINT "booking_change_log_reservation_id_reservation_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservation"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "infraction" ADD CONSTRAINT "infraction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "infraction" ADD CONSTRAINT "infraction_reservation_id_reservation_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservation"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "infraction" ADD CONSTRAINT "infraction_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "key" ADD CONSTRAINT "key_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "key_transaction_log" ADD CONSTRAINT "key_transaction_log_reservation_id_reservation_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservation"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "key_transaction_log" ADD CONSTRAINT "key_transaction_log_key_id_key_id_fk" FOREIGN KEY ("key_id") REFERENCES "public"."key"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "key_transaction_log" ADD CONSTRAINT "key_transaction_log_borrowed_to_user_id_fk" FOREIGN KEY ("borrowed_to") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "key_transaction_log" ADD CONSTRAINT "key_transaction_log_handled_by_user_id_fk" FOREIGN KEY ("handled_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_log" ADD CONSTRAINT "notification_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_log" ADD CONSTRAINT "notification_log_booking_change_log_id_booking_change_log_id_fk" FOREIGN KEY ("booking_change_log_id") REFERENCES "public"."booking_change_log"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_room_code_unique" UNIQUE("room_code");