'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'
import { Provider } from '@supabase/supabase-js'
import { getURL } from '@/utils/helpers'

export async function emailLogin(formData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email'),
        password: formData.get('password') 
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?message=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    redirect('/todos')
}

export async function signup(formData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email'),
        password: formData.get('password') 
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/login?message=Error signing up')
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login')
}

export async function oAuthSignIn(provider) {
    if (!provider) {
        return redirect('/login?message=No provider selected')
    }

    const supabase = createClient();
    const redirectUrl = getURL("/auth/callback")
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: redirectUrl,
        }
    })

    if (error) {
        redirect('/login?message=Could not authenticate user')
    }

    return redirect(data.url)
}