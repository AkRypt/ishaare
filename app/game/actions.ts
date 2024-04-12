'use server';

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function getWords(deck_id: number) {
    const supabase = createClient()

    const { data, error, status } = await supabase
        .from('words')
        .select("*")
        .eq('deck_id', deck_id)

    if (error && status !== 406) {
        console.log(error)
        throw error
    }

    return data
}

export async function ilog(text: string) {
    console.log(text)
}