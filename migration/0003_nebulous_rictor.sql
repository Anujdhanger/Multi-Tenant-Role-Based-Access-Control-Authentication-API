CREATE TABLE IF NOT EXISTS "userToRoles" (
	"applicationId" uuid NOT NULL,
	"roleId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "userToRoles_applicationId_roleId_userId_pk" PRIMARY KEY("applicationId","roleId","userId")
);

DO $$ BEGIN
 ALTER TABLE "userToRoles" ADD CONSTRAINT "userToRoles_applicationId_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "userToRoles" ADD CONSTRAINT "userToRoles_roleId_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "userToRoles" ADD CONSTRAINT "userToRoles_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
