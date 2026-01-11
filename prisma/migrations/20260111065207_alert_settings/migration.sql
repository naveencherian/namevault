-- CreateTable
CREATE TABLE "AlertSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alert30Days" BOOLEAN NOT NULL DEFAULT true,
    "alert7Days" BOOLEAN NOT NULL DEFAULT true,
    "alert1Day" BOOLEAN NOT NULL DEFAULT true,
    "weeklySummary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlertSettings_userId_key" ON "AlertSettings"("userId");

-- AddForeignKey
ALTER TABLE "AlertSettings" ADD CONSTRAINT "AlertSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
