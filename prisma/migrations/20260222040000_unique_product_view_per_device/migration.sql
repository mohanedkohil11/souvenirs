-- First remove any duplicates keeping the earliest view
DELETE FROM "ProductView" a USING "ProductView" b
WHERE a."id" > b."id"
  AND a."productId" = b."productId"
  AND a."deviceId" = b."deviceId";

-- Drop the old deviceId index (replaced by the unique constraint)
DROP INDEX IF EXISTS "ProductView_deviceId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "ProductView_productId_deviceId_key" ON "ProductView"("productId", "deviceId");
