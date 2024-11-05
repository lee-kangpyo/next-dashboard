import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
 
export default async function Page(props:{searchParams?:Promise<{query?:string, page?:string}>}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  // <Search> => 클라이언트 컴포넌트, useSearchParams() hook을 사용.
  //             사용자의 입력을 url에 전달하기 때문에 page에 있는 props를 사용하기 애매함.
  //             또한 클라이언트에서 바로 params를 읽어서 속도가 빠름. (서버를 경유하지 않음)

  // <Table>  => 서버 컴포넌트, hook을 사용할수없다. 
  //             데이터베이스의 데이터를 가져오기위해 page.tsx에서 searchParams prop을 전달.
  const totalPages = await fetchInvoicesPages(query);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}