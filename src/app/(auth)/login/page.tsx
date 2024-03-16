"use client"
import React from 'react'
import { auth } from "@/lib/firebase"
import { type SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, type LoginCredentials } from "@/lib/zod"
import { redirect, useRouter } from "next/navigation"
import { PageRoutes } from "@/utils/enums"
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"
import { Anchor, Button, Divider, Group, Paper, PasswordInput, Stack, Text, TextInput } from "@mantine/core"

export default function LoginPage(): React.JSX.Element {
	const router = useRouter()
	const [signInWithEmailAndPassword, _user, isSubmitting, _error] = useSignInWithEmailAndPassword(auth);

	const {
		register,
		handleSubmit,
		formState: { errors: formErrors }
	} = useForm<LoginCredentials>({ resolver: zodResolver(LoginSchema) })

	const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
		const response = await signInWithEmailAndPassword(data.email, data.password)

		if (response && response.user) {
			try { redirect(PageRoutes.Home) }
			catch (error) { }
		}
	}

	return (
		<Paper radius="md" p="xl">
			<Text size="lg" fw={500}>
				Welcome to Time Tracker
			</Text>
			<Divider labelPosition="center" my="lg" />
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack>
					<TextInput
						{...register('email')}
						label="Email"
						radius="md"
						placeholder="hello@mantine.dev"
						error={formErrors.email?.message}
					/>
					<PasswordInput
						{...register('password')}
						label="Password"
						radius="md"
						placeholder="Your password"
						error={formErrors.password?.message}
					/>
				</Stack>
				<Group justify="space-between" mt="xl">
					<Anchor
						size="xs"
						c="dimmed"
						type="button"
						component="button"
						onClick={() => router.push(PageRoutes.Register)}
					>
						Don&apos;t have an account? Register
					</Anchor>
					<Button loading={isSubmitting} disabled={isSubmitting} type="submit" radius="xl">
						Login
					</Button>
				</Group>
			</form>
		</Paper>
	)
}
