-- AlterTable
ALTER TABLE "services" ADD COLUMN     "accent_color" TEXT NOT NULL DEFAULT '#3b82f6',
ADD COLUMN     "card_type" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN     "category_label" TEXT,
ADD COLUMN     "cta_href" TEXT NOT NULL DEFAULT '#contact',
ADD COLUMN     "cta_label" TEXT NOT NULL DEFAULT 'Learn more',
ADD COLUMN     "image_url" TEXT;
