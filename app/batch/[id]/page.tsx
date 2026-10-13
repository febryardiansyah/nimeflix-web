import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBatch } from "@/lib/api";
import { Downloads } from "@/components/downloads";
import { Container, PageHeader } from "@/components/ui";

export async function generateMetadata({
  params,
}: PageProps<"/batch/[id]">): Promise<Metadata> {
  const batch = await getBatch((await params).id);
  return { title: batch?.title ?? "Batch" };
}

export default function BatchPage({ params }: PageProps<"/batch/[id]">) {
  return (
    <Container className="max-w-4xl">
      <Suspense fallback={<div className="skeleton h-80" />}>
        <Batch params={params} />
      </Suspense>
    </Container>
  );
}

async function Batch({ params }: Pick<PageProps<"/batch/[id]">, "params">) {
  const batch = await getBatch((await params).id);
  if (!batch) notFound();

  return (
    <>
      <PageHeader eyebrow="Download batch" title={batch.title} jp="一括" />
      <Downloads groups={batch.downloads} />
    </>
  );
}
