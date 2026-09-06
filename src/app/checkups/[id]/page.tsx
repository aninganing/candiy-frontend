import { CheckupDetail } from '@/features/checkups/components/CheckupDetail';

export default async function CheckupDetailPage(props: PageProps<'/checkups/[id]'>) {
  const { id } = await props.params;
  return <CheckupDetail id={id} />;
}
