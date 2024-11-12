'use server'
import { sql } from '@vercel/postgres';
import {z} from 'zod'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const FormSchema = z.object({
    id:z.string(),
    customerId:z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount:z.coerce.number().gt(0, {message: "0보다 큰수를 입력"}),
    status:z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select a invoice status.',
    }),
    date:z.string(),
})

export type State = {
    error?:{
        customerId?: string[];
        amount?: string[];
        status?: string[];
    },
    message?: string | null;
}

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (prevState: State, formData: FormData) => {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
          };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

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

export const updateInvoice = async(id: string, formData:FormData) => {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
          `;
      } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
      }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export const deleteInvoice = async (id:string) => {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
      } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
      }

}