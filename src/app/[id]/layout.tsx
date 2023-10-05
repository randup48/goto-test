'use client';
import { useParams } from 'next/navigation';
export default function Layout(props: {
  children: React.ReactNode;
  addPage: React.ReactNode;
  editPage: React.ReactNode;
}) {
  const param = useParams();
  return (
    <div className='p-5 mx-auto max-w-screen-lg'>
      {props.children}
      {param.id === 'add' && props.addPage}
      {param.id !== 'add' && props.editPage}
    </div>
  );
}
