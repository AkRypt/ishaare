'use server';

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'


export async function logging(data: any) {
    console.log("data in logging:", JSON.stringify(data))
}