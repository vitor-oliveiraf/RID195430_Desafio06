/*
  Warnings:

  - A unique constraint covering the columns `[produtoId]` on the table `estoques` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `produtoId` to the `estoques` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."estoques" ADD COLUMN     "produtoId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "estoques_produtoId_key" ON "public"."estoques"("produtoId");

-- AddForeignKey
ALTER TABLE "public"."estoques" ADD CONSTRAINT "estoques_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
