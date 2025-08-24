import { redirect } from 'next/navigation';

export default function HomePage() {
  // Egyszerű átirányítás az ADHD kvízre
  redirect('/hu/adhd-quick-check/');
}
