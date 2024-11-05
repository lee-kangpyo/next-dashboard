'use server'
import { sql } from '@vercel/postgres';
import {z} from 'zod'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const FormSchema = z.object({
    id:z.string(),
    customerId:z.string(),
    amount:z.coerce.number(),
    status:z.enum(['pending', 'paid']),
    date:z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (formData: FormData) => {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    // 캐시 무효화
    revalidatePath('/dashboard/invoices');
    // 리다이렉트
    redirect('/dashboard/invoices');
    
    // 둘중 한가지 방식으로 formData를 구성가능
    // 위에 방식은 밸리데이션 처리가 추가된 방식
    // const rawFormData = {
    //     customerId: formData.get('customerId'),
    //     amount: formData.get('amount'),
    //     status: formData.get('status'),
    // };
    //   const rawFormData2 = Object.fromEntries(formData.entries())
}
