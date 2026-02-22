-- AlterTable
ALTER TABLE "Order" ADD COLUMN "deliveryPeriod" TEXT NOT NULL DEFAULT 'morning';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "city" SET DEFAULT 'Hurghada';

-- DropColumn
ALTER TABLE "Order" DROP COLUMN IF EXISTS "state";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "zipCode";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "country";
