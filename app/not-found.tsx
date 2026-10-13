import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="font-display text-8xl text-vermilion">404</p>
      <p className="mt-4 font-display text-2xl">Halaman tidak ditemukan</p>
      <p className="mt-2 text-mute">
        Anime atau episode yang kamu cari tidak ada.
      </p>
      <Link href="/" className="btn mt-8">
        Kembali ke beranda
      </Link>
    </Container>
  );
}
