"use client";

import { Container } from "@/components/ui";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="py-32 text-center">
      <p className="font-display text-6xl text-vermilion">エラー</p>
      <p className="mt-4 font-display text-2xl">Gagal memuat data</p>
      <p className="mt-2 text-mute">
        Server API sedang bermasalah. Coba lagi sebentar.
      </p>
      <button type="button" onClick={reset} className="btn mt-8">
        Coba lagi
      </button>
    </Container>
  );
}
