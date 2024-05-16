"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTodo(formData) {
    const supabase = createClient();
    const text = formData.get("todo")

    if (!text) {
        throw new Error("Text is required")
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("User is not logged in")
    }

    const { error } = await supabase.from("todos").insert({
        task: text,
        user_id: user.id
    })

    if (error) {
        throw new Error("Error adding task")
    }

    revalidatePath("/todos")
}

export async function deleteTodo(id) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("User is not logged in")
    }

    const { error } = await supabase.from("todos").delete().match({
        user_id: user.id,
        id: id
    })

    if (error) {
        throw new Error("Error deleting task")
    }

    revalidatePath("/todos")
}

export async function updateTodo(todo) {


    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("User is not logged in")
    }

    const { error } = await supabase.from("todos").update(todo).match({
        user_id: user.id,
        id: todo.id
    })

    if (error) {
        throw new Error("Error updating task")
    }

    revalidatePath("/todos")
}